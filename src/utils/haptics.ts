/**
 * Haptic and micro-tactile feedback engine.
 * Leverages navigator.vibrate when available, paired with Web Audio API micro-pulses
 * to ensure rich tactile feedback across desktop, tablet, and mobile devices.
 */

class HapticsEngine {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Tactile click on field drag start or selection
   */
  public tick() {
    if (!this.enabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Ignore iframe restrictions
      }
    }
    this.playTone(600, 0.015, 'triangle', 0.05);
  }

  /**
   * Tactile latch when dropping a field into an assignable slot
   */
  public snap() {
    if (!this.enabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 30, 20]);
      } catch {
        // Ignore
      }
    }
    this.playDoubleTone(440, 720, 0.035, 'sine', 0.12);
  }

  /**
   * Joyful chime for wild visualization triggers or custom variable creations
   */
  public bananas() {
    if (!this.enabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([10, 40, 15, 40, 25]);
      } catch {
        // Ignore
      }
    }
    this.playArpeggio([523.25, 659.25, 783.99, 1046.5]);
  }

  /**
   * Clear / Remove slot feedback
   */
  public remove() {
    if (!this.enabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore
      }
    }
    this.playTone(320, 0.025, 'sawtooth', 0.06);
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.08) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  private playDoubleTone(f1: number, f2: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.08) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = type;
      osc1.frequency.setValueAtTime(f1, now);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(f2, now + 0.015);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + duration);
      osc2.start(now + 0.012);
      osc2.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  private playArpeggio(notes: number[]) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.04;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.08, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.12);
      });
    } catch {
      // Ignore
    }
  }
}

export const haptics = new HapticsEngine();
