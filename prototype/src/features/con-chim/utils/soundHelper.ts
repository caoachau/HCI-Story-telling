// Interactive Web Audio Soundscape Synthesizer for Ha Long Bay (Gentle ocean waves & harmonic resonance)

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private waveGain: GainNode | null = null;
  private timer: number | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  private start() {
    if (!this.ctx) return;
    this.isPlaying = true;

    // Ocean waves pink noise approximation
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    this.waveGain = this.ctx.createGain();
    this.waveGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // slow wave tide every 8 seconds
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.04;

    lfo.connect(lfoGain);
    lfoGain.connect(this.waveGain.gain);

    noise.connect(filter);
    filter.connect(this.waveGain);
    this.waveGain.connect(this.ctx.destination);

    noise.start();
    lfo.start();

    // Subtle gentle chime every 10 seconds
    const playChime = () => {
      if (!this.isPlaying || !this.ctx) return;
      const notes = [293.66, 329.63, 440.00, 493.88, 587.33]; // Pentatonic scale (D, E, A, B, D)
      const freq = notes[Math.floor(Math.random() * notes.length)];
      
      const osc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      chimeGain.gain.setValueAtTime(0, this.ctx.currentTime);
      chimeGain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4);
      
      osc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 4.5);
    };

    this.timer = window.setInterval(playChime, 7000);
  }

  private stop() {
    this.isPlaying = false;
    if (this.waveGain && this.ctx) {
      this.waveGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
    }
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const soundscape = new SoundscapeManager();
