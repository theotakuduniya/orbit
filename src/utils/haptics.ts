/**
 * Haptic & tactile feedback utility for mobile touch experience
 * Leverages navigator.vibrate when available and Web Audio API synthesizer for tactile clicks
 */

class HapticsController {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Light tactile tap (button clicks, chip switches)
  light() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
    this.playTone(800, 0.02, 'sine', 0.05);
  }

  // Medium impact (drawer open, tier list assignment, PiP swap)
  medium() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([15, 30, 15]);
      } catch {
        // ignore
      }
    }
    this.playTone(420, 0.04, 'triangle', 0.1);
  }

  // Heavy impact (delete, clear canvas)
  heavy() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(35);
      } catch {
        // ignore
      }
    }
    this.playTone(220, 0.08, 'sawtooth', 0.12);
  }

  // Selection tick (picker, sliders, horizontal scroller)
  selection() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(5);
      } catch {
        // ignore
      }
    }
    this.playTone(1200, 0.015, 'sine', 0.04);
  }

  // Success chord (Watchlist Tinder Match, Bucket List completion)
  success() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([20, 40, 20, 40, 50]);
      } catch {
        // ignore
      }
    }
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  // Camera shutter sound for DualSnap
  shutter() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([10, 40, 20]);
      } catch {
        // ignore
      }
    }
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Click 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(1400, now);
    osc1.type = 'sine';
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Mechanical snap
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.setValueAtTime(500, now + 0.06);
    osc2.type = 'triangle';
    gain2.gain.setValueAtTime(0.25, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.12);
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.08) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext could be blocked until first user gesture
    }
  }
}

export const haptics = new HapticsController();
