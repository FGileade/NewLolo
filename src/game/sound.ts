/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Game Boy Advance Polyphonic Audio Synthesizer
 * Inspired by the rich soundscapes of The Legend of Zelda: The Minish Cap & Golden Sun
 */

import { WorldTheme } from './types';

class GBASoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private sfxVolume: number = 0.55;
  private musicVolume: number = 0.4;

  private isPlayingBgm: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmNoteIndex: number = 0;
  private currentWorld: WorldTheme = 'CASTLE';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // GBA warm DAC output filter (simulates GBA speaker / headphone warmth ~9kHz lowpass)
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(8500, this.ctx.currentTime);
      this.filterNode.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.filterNode);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.filterNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public enableAudio() {
    this.initContext();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMusicMute(muted: boolean) {
    this.isMusicMuted = muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(muted ? 0 : this.musicVolume, this.ctx.currentTime);
    }
  }

  public toggleMusic(): boolean {
    this.setMusicMute(!this.isMusicMuted);
    return this.isMusicMuted;
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  // --- GBA SOUND EFFECTS ---

  public playStep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Soft GBA leather boot step
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + Math.random() * 20, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playHeart() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Golden Sun / Minish Cap crystal harp glissando
    const notes = [880.0, 1174.66, 1318.51, 1760.0]; // A5, D6, E6, A6
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = this.ctx!.currentTime + i * 0.045;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  public playShoot() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Magic energy shot whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.12);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playEggHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.26, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playEggLaunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(1600, t + 0.35);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  public playEggSplash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.2);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  public playPush() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Heavy stone friction rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.14);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  public playLaser() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.28);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  public playChestOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Triumphant GBA treasure fanfares (Zelda chest opening chords!)
    const notes = [
      { f: 587.33, d: 0.08 }, // D5
      { f: 659.25, d: 0.08 }, // E5
      { f: 783.99, d: 0.08 }, // G5
      { f: 880.00, d: 0.08 }, // A5
      { f: 1174.66, d: 0.3 }  // D6 (sustained shine)
    ];

    let time = this.ctx.currentTime;
    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);

      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + note.d);

      time += note.d * 0.9;
    });
  }

  public playDoorOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.2);

    gain.gain.setValueAtTime(0.26, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  public playStageClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Joyful Minish Cap style room cleared fanfare
    const melody = [
      { f: 587.33, d: 0.1 },  // D5
      { f: 739.99, d: 0.1 },  // F#5
      { f: 880.00, d: 0.1 },  // A5
      { f: 1174.66, d: 0.2 }, // D6
      { f: 987.77, d: 0.1 },  // B5
      { f: 1174.66, d: 0.35 } // D6
    ];

    let time = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + note.d);

      time += note.d * 1.05;
    });
  }

  public playDeath() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.linearRampToValueAtTime(95, t + 0.45);

    gain.gain.setValueAtTime(0.26, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  public playSelect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // --- GBA BGM ENGINE (Themed per World) ---

  public startBgm(theme: WorldTheme = 'CASTLE') {
    this.currentWorld = theme;
    if (this.isPlayingBgm) return;
    this.initContext();
    this.isPlayingBgm = true;

    const stepTime = 120; // ms per step
    this.bgmNoteIndex = 0;

    // Melodies per world
    const castleMelody = [
      587.33, 0, 739.99, 0, 880.00, 0, 739.99, 0,
      659.25, 0, 739.99, 0, 587.33, 0, 440.00, 0,
      587.33, 0, 659.25, 0, 739.99, 0, 880.00, 0,
      987.77, 0, 880.00, 0, 739.99, 0, 0, 0
    ];
    const castleBass = [
      146.83, 146.83, 220.00, 146.83, 146.83, 146.83, 220.00, 146.83,
      164.81, 164.81, 246.94, 164.81, 146.83, 146.83, 220.00, 146.83,
      196.00, 196.00, 293.66, 196.00, 220.00, 220.00, 329.63, 220.00,
      146.83, 146.83, 220.00, 146.83, 146.83, 220.00, 146.83, 0
    ];

    const shadowTowerMelody = [
      440.00, 0, 440.00, 493.88, 523.25, 0, 440.00, 0,
      392.00, 0, 440.00, 0, 329.63, 0, 0, 0,
      440.00, 0, 523.25, 0, 659.25, 0, 587.33, 0,
      523.25, 0, 493.88, 0, 440.00, 0, 0, 0
    ];
    const shadowTowerBass = [
      110.00, 110.00, 164.81, 110.00, 110.00, 110.00, 164.81, 110.00,
      98.00, 98.00, 146.83, 98.00, 82.41, 82.41, 123.47, 82.41,
      110.00, 110.00, 164.81, 110.00, 130.81, 130.81, 196.00, 130.81,
      123.47, 123.47, 185.00, 123.47, 110.00, 110.00, 164.81, 0
    ];

    this.bgmIntervalId = window.setInterval(() => {
      if (this.isMuted || this.isMusicMuted || !this.ctx || !this.musicGain) {
        this.bgmNoteIndex++;
        return;
      }

      const isBoss = this.currentWorld === 'SHADOW_TOWER';
      const melody = isBoss ? shadowTowerMelody : castleMelody;
      const bass = isBoss ? shadowTowerBass : castleBass;

      const mIdx = this.bgmNoteIndex % melody.length;
      const bIdx = this.bgmNoteIndex % bass.length;

      const mFreq = melody[mIdx];
      const bFreq = bass[bIdx];
      const t = this.ctx.currentTime;

      if (mFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // GBA warm filtered triangle / square synth
        osc.type = isBoss ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(mFreq, t);

        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.11);
      }

      if (bFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bFreq, t);

        bassGain.gain.setValueAtTime(0.14, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(t);
        bassOsc.stop(t + 0.11);
      }

      this.bgmNoteIndex++;
    }, stepTime);
  }

  public stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const sound = new GBASoundManager();
