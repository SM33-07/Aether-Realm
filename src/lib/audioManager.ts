"use client";

import { Howl, Howler } from "howler";

export type SfxName =
  | "click"
  | "interact"
  | "dialogue"
  | "levelUp"
  | "zoneEnter"
  | "close";

interface AudioManifestItem {
  src: string[];
  volume: number;
}

// Manifest for external audio files. Set src to empty or valid paths in public/
const AUDIO_MANIFEST: Record<SfxName, AudioManifestItem | null> = {
  click: null,
  interact: null,
  dialogue: null,
  levelUp: null,
  zoneEnter: null,
  close: null,
};

const AMBIENT_MANIFEST: AudioManifestItem | null = null;

class AudioManager {
  private static instance: AudioManager | null = null;
  private initialized = false;
  private muted = false;
  private masterVolume = 0.5;
  private ambientHowl: Howl | null = null;
  private sfxHowls: Map<SfxName, Howl> = new Map();
  private audioCtx: AudioContext | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;
  private listeners: Set<(muted: boolean) => void> = new Set();

  private constructor() {
    if (typeof window !== "undefined") {
      // Load mute preference from localStorage if available
      try {
        const savedMute = localStorage.getItem("aether-audio-muted");
        if (savedMute !== null) {
          this.muted = savedMute === "true";
        }
      } catch {
        // ignore
      }
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public subscribe(callback: (muted: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.muted);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.muted));
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public initializeAudio() {
    if (typeof window === "undefined") return;

    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        // @ts-expect-error webkitAudioContext support
        window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }

    // Unlock Howler audio
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume().catch(() => {});
    }

    this.initialized = true;
    this.updateMasterMute();
  }

  public unlockAudio() {
    this.initializeAudio();
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    Howler.volume(this.muted ? 0 : this.masterVolume);
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(
        this.muted ? 0 : this.masterVolume * 0.12,
        this.audioCtx.currentTime
      );
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem("aether-audio-muted", String(muted));
    } catch {
      // ignore
    }
    this.updateMasterMute();
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private updateMasterMute() {
    Howler.mute(this.muted);
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(
        this.muted ? 0 : this.masterVolume * 0.12,
        this.audioCtx.currentTime
      );
    }
  }

  public playAmbient() {
    if (typeof window === "undefined") return;
    this.initializeAudio();

    // If external ambient audio is configured in manifest
    if (AMBIENT_MANIFEST && AMBIENT_MANIFEST.src.length > 0) {
      if (!this.ambientHowl) {
        this.ambientHowl = new Howl({
          src: AMBIENT_MANIFEST.src,
          html5: true,
          loop: true,
          volume: AMBIENT_MANIFEST.volume * this.masterVolume,
        });
      }
      if (!this.ambientHowl.playing()) {
        this.ambientHowl.play();
      }
      return;
    }

    // Procedural ambient ethereal synthesis
    this.startProceduralAmbient();
  }

  private startProceduralAmbient() {
    if (!this.audioCtx || this.ambientOscillators.length > 0) return;

    try {
      const now = this.audioCtx.currentTime;
      const master = this.audioCtx.createGain();
      master.gain.setValueAtTime(
        this.muted ? 0 : this.masterVolume * 0.12,
        now
      );
      master.connect(this.audioCtx.destination);
      this.ambientGain = master;

      // Soft filter for deep underwater / celestial drone
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, now);
      filter.connect(master);

      // Low ethereal chord frequencies: D2 (73.4Hz), A2 (110Hz), D3 (146.8Hz)
      const freqs = [73.41, 110.0, 146.83, 220.0];
      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq + (idx * 0.2 - 0.3), now);

        const oscGain = this.audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.25 / freqs.length, now);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.ambientOscillators.push(osc);
      });
    } catch {
      // AudioContext might not be ready or allowed yet
    }
  }

  public stopAmbient() {
    if (this.ambientHowl) {
      this.ambientHowl.fade(this.ambientHowl.volume(), 0, 500);
      setTimeout(() => {
        this.ambientHowl?.stop();
      }, 500);
    }

    if (this.ambientGain && this.audioCtx) {
      try {
        this.ambientGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      } catch {
        // ignore
      }
    }
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.ambientOscillators = [];
  }

  public playSfx(name: SfxName) {
    if (this.muted || typeof window === "undefined") return;
    this.initializeAudio();

    // Check external Howler manifest
    const manifestItem = AUDIO_MANIFEST[name];
    if (manifestItem && manifestItem.src.length > 0) {
      let sound = this.sfxHowls.get(name);
      if (!sound) {
        sound = new Howl({
          src: manifestItem.src,
          volume: manifestItem.volume * this.masterVolume,
        });
        this.sfxHowls.set(name, sound);
      }
      sound.play();
      return;
    }

    // Procedural sound effects synthesizer
    this.playProceduralSfx(name);
  }

  private playProceduralSfx(name: SfxName) {
    if (!this.audioCtx || this.muted) return;

    try {
      const now = this.audioCtx.currentTime;

      switch (name) {
        case "click": {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

          gain.gain.setValueAtTime(0.15 * this.masterVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case "interact": {
          // Ascending dual crystal chime
          [523.25, 659.25, 783.99].forEach((freq, i) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const start = now + i * 0.06;

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.18 * this.masterVolume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.35);
          });
          break;
        }

        case "dialogue": {
          // Soft subtle mechanical chirp
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(1200 + Math.random() * 200, now);

          gain.gain.setValueAtTime(0.04 * this.masterVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }

        case "levelUp": {
          // Triumphant arpeggiated harmonic chord
          const notes = [440, 554.37, 659.25, 880, 1108.73];
          notes.forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const start = now + idx * 0.07;

            osc.type = idx % 2 === 0 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.2 * this.masterVolume, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.65);
          });
          break;
        }

        case "zoneEnter": {
          // Deep dimensional sweep
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.3);

          gain.gain.setValueAtTime(0.2 * this.masterVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
          break;
        }

        case "close": {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

          gain.gain.setValueAtTime(0.12 * this.masterVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
      }
    } catch {
      // ignore
    }
  }

  public disposeAudio() {
    this.stopAmbient();
    this.sfxHowls.forEach((h) => h.unload());
    this.sfxHowls.clear();
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.initialized = false;
  }
}

// Export singleton helper methods
export const audioManager = AudioManager.getInstance();
export const initializeAudio = () => audioManager.initializeAudio();
export const unlockAudio = () => audioManager.unlockAudio();
export const playAmbient = () => audioManager.playAmbient();
export const stopAmbient = () => audioManager.stopAmbient();
export const playSfx = (name: SfxName) => audioManager.playSfx(name);
export const setMasterVolume = (vol: number) => audioManager.setMasterVolume(vol);
export const setMuted = (muted: boolean) => audioManager.setMuted(muted);
export const toggleMute = () => audioManager.toggleMute();
export const isMuted = () => audioManager.isMuted();
export const disposeAudio = () => audioManager.disposeAudio();
