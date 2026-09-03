/**
 * Web Audio Synthesizer for Frustragram.
 * Synthesizes background music loops and cursed UI sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private volume: number = 0.35; // 0 to 1
  private timerId: number | null = null;
  private step: number = 0;

  public tracks = [
    {
      id: 'track-1',
      title: 'Elevator To Nowhere',
      artist: 'DJ Comic Sans',
      bpm: 110,
      scale: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25],
      bassScale: [130.81, 146.83, 164.81, 174.61, 196.0],
    },
    {
      id: 'track-2',
      title: 'Dial-up Modem Jam',
      artist: 'Error 404 Orchestra',
      bpm: 135,
      scale: [220.0, 246.94, 261.63, 293.66, 329.63, 392.0, 440.0],
      bassScale: [110.0, 123.47, 130.81, 146.83, 164.81],
    },
    {
      id: 'track-3',
      title: 'Nokia Ringtone Dubstep',
      artist: 'Lil Buffer',
      bpm: 145,
      scale: [329.63, 293.66, 246.94, 277.18, 329.63, 440.0, 493.88],
      bassScale: [82.41, 110.0, 123.47, 146.83],
    },
    {
      id: 'track-4',
      title: 'Pop-up Symphony in F# Meltdown',
      artist: 'Grandmaster BSOD',
      bpm: 125,
      scale: [369.99, 415.3, 440.0, 493.88, 554.37, 659.25],
      bassScale: [92.5, 110.0, 123.47, 138.59],
    },
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public startMusic() {
    this.isPlaying = true;
    this.scheduleNextTick();
  }

  private scheduleNextTick() {
    if (!this.isPlaying) return;
    const track = this.tracks[this.currentTrackIndex];
    const intervalMs = (60 / track.bpm / 2) * 1000; // sixteenth note

    this.timerId = window.setTimeout(() => {
      this.playNoteStep();
      this.scheduleNextTick();
    }, intervalMs);
  }

  private playNoteStep() {
    try {
      const ctx = this.getContext();
      const track = this.tracks[this.currentTrackIndex];
      this.step = (this.step + 1) % 16;

      if (this.volume <= 0.01) return;

      // Melody note
      if (this.step % 2 === 0 || Math.random() > 0.4) {
        const noteIndex = (this.step * 3 + this.currentTrackIndex) % track.scale.length;
        const freq = track.scale[noteIndex];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = this.currentTrackIndex % 2 === 0 ? 'square' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const currentVol = this.volume * 0.15;
        gain.gain.setValueAtTime(currentVol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }

      // Bass note
      if (this.step % 4 === 0) {
        const bassNote = track.bassScale[(Math.floor(this.step / 4) + this.currentTrackIndex) % track.bassScale.length];
        const oscBass = ctx.createOscillator();
        const gainBass = ctx.createGain();
        oscBass.type = 'triangle';
        oscBass.frequency.setValueAtTime(bassNote, ctx.currentTime);

        const currentVol = this.volume * 0.25;
        gainBass.gain.setValueAtTime(currentVol, ctx.currentTime);
        gainBass.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

        oscBass.connect(gainBass);
        gainBass.connect(ctx.destination);

        oscBass.start();
        oscBass.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio autoplay policy catch
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.step = 0;
    this.playClickSfx();
  }

  /**
   * REVERSE VOLUME LOGIC:
   * Prompt specifies: "volume slider reverses (up = quieter)".
   * Input value rawSlider is 0 (slider at bottom/left) to 100 (slider at top/right).
   * Sliding up -> rawSlider goes to 100 -> audio volume becomes 0!
   * Sliding down -> rawSlider goes to 0 -> audio volume becomes 1.0 (loudest)!
   */
  public setReverseVolume(rawSliderValue0to100: number) {
    // rawSlider: 100 => vol 0; 0 => vol 1.0
    const inverted = (100 - rawSliderValue0to100) / 100;
    this.volume = Math.max(0, Math.min(1, inverted));
  }

  public getRawSliderValue(): number {
    return Math.round((1 - this.volume) * 100);
  }

  public getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  public playClickSfx() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  public playBuzzer() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  public playFanfare() {
    try {
      const ctx = this.getContext();
      [440, 554, 659, 880].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.22);
      });
    } catch {}
  }
  public playKeyBeep(char?: string) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 400 + ((char ? char.charCodeAt(0) * 17 : Math.random() * 500) % 600);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  public playCameraSnap() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
