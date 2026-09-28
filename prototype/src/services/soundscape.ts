/**
 * Web Audio Generative Soundscape & Voice Narration Engine
 * Realistic generative audio for museum exhibition kiosks without external dependencies.
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSoundscape(type: 'temple_bell' | 'wooden_loom' | 'mountain_stream' | 'pottery_wheel' | 'bronze_gong') {
    this.stopSoundscape();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentType = type;

    switch (type) {
      case 'temple_bell':
        this.playBellTone();
        this.intervalId = window.setInterval(() => {
          if (this.isPlaying) this.playBellTone();
        }, 5500);
        break;

      case 'bronze_gong':
        this.playGongTone();
        this.intervalId = window.setInterval(() => {
          if (this.isPlaying) this.playGongTone();
        }, 4500);
        break;

      case 'wooden_loom':
        this.playLoomRhythm();
        this.intervalId = window.setInterval(() => {
          if (this.isPlaying) this.playLoomRhythm();
        }, 1400);
        break;

      case 'mountain_stream':
        this.playStreamAmbience();
        break;

      case 'pottery_wheel':
        this.playPotteryWheel();
        break;
    }
  }

  public stopSoundscape() {
    this.isPlaying = false;
    this.currentType = null;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx && this.masterGain) {
      // smooth fade out
      this.masterGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.2);
    }
  }

  public toggle(type: 'temple_bell' | 'wooden_loom' | 'mountain_stream' | 'pottery_wheel' | 'bronze_gong') {
    if (this.isPlaying && this.currentType === type) {
      this.stopSoundscape();
      return false;
    } else {
      this.playSoundscape(type);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): string | null {
    return this.currentType;
  }

  // Generative instruments:
  private playBellTone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const freqs = [174, 348, 522, 696];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.18 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 4.6);
    });
  }

  private playGongTone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const baseFreq = 110; // Low resonance gong
    const harmonics = [110, 165, 230, 310, 480];

    harmonics.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), now);

      const volume = 0.2 / (i * 0.8 + 1);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 3.9);
    });
  }

  private playLoomRhythm() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // First click: shuttle throw
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(150, now + 0.08);
    g1.gain.setValueAtTime(0.12, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(g1);
    g1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // Second thud: reed beat (0.35s later)
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(180, now + 0.35);
    osc2.frequency.exponentialRampToValueAtTime(60, now + 0.48);
    g2.gain.setValueAtTime(0.2, now + 0.35);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.49);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(now + 0.35);
    osc2.stop(now + 0.5);
  }

  private playStreamAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  private playPotteryWheel() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);

    // subtle LFO frequency mod
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(1.5, now);
    lfoGain.gain.setValueAtTime(12, now);
    lfo.connect(osc.frequency);
    lfo.start(now);

    gain.gain.setValueAtTime(0.08, now);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
  }
}

export const soundscape = new SoundscapeEngine();

/**
 * Speech Synthesis Narrator for Heritage Oral Interpretation
 */
export const narrateStory = (text: string, lang: 'vi-VN' | 'en-US' = 'vi-VN', onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Attempt to select optimal natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopNarration = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
