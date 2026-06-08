export class SoundManager {
  constructor() {
    this.soundsOn = this._load('te_sounds', true);
    this.musicOn  = this._load('te_music',  false);
    this._ctx     = null;
  }

  _load(key, def) {
    const v = localStorage.getItem(key);
    return v === null ? def : v === 'true';
  }

  _save(key, val) {
    localStorage.setItem(key, String(val));
  }

  setSounds(on) {
    this.soundsOn = on;
    this._save('te_sounds', on);
  }

  setMusic(on) {
    this.musicOn = on;
    this._save('te_music', on);
  }

  _ctx_get() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._ctx;
  }

  // ── Synth sound generator ─────────────────────────────────────────
  _play(type, opts = {}) {
    if (!this.soundsOn) return;
    try {
      const ctx  = this._ctx_get();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.type = opts.wave ?? 'sine';
      osc.frequency.setValueAtTime(opts.freq ?? 440, now);
      if (opts.freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(opts.freqEnd, now + (opts.dur ?? 0.15));
      }

      gain.gain.setValueAtTime(opts.vol ?? 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (opts.dur ?? 0.15));

      osc.start(now);
      osc.stop(now + (opts.dur ?? 0.15));
    } catch(e) {}
  }

  // ── Sound effects ─────────────────────────────────────────────────

  move() {
    this._play({ wave: 'sine', freq: 220, freqEnd: 280, dur: 0.08, vol: 0.15 });
  }

  shoot() {
    this._play({ wave: 'sawtooth', freq: 400, freqEnd: 150, dur: 0.1, vol: 0.12 });
  }

  hit() {
    this._play({ wave: 'square', freq: 180, freqEnd: 80, dur: 0.18, vol: 0.25 });
  }

  eatTower() {
    // Rising triumphant tone
    this._play({ wave: 'sine', freq: 300, freqEnd: 600, dur: 0.2, vol: 0.3 });
    setTimeout(() => {
      this._play({ wave: 'sine', freq: 600, freqEnd: 900, dur: 0.2, vol: 0.25 });
    }, 150);
  }

  unlockBase() {
    // 3-note fanfare
    [0, 150, 300].forEach((delay, i) => {
      setTimeout(() => {
        this._play({ wave: 'sine', freq: [440, 554, 659][i], dur: 0.25, vol: 0.3 });
      }, delay);
    });
  }

  win() {
    // Victory arpeggio
    [0, 120, 240, 360].forEach((delay, i) => {
      setTimeout(() => {
        this._play({ wave: 'sine', freq: [523, 659, 784, 1047][i], dur: 0.3, vol: 0.3 });
      }, delay);
    });
  }

  death() {
    // Descending sad tones
    [0, 150, 300].forEach((delay, i) => {
      setTimeout(() => {
        this._play({ wave: 'sawtooth', freq: [300, 220, 150][i], dur: 0.25, vol: 0.25 });
      }, delay);
    });
  }

  freeze() {
    this._play({ wave: 'sine', freq: 800, freqEnd: 400, dur: 0.3, vol: 0.2 });
  }

  grenade() {
    // Low boom
    this._play({ wave: 'square', freq: 120, freqEnd: 40, dur: 0.35, vol: 0.35 });
    setTimeout(() => {
      this._play({ wave: 'sawtooth', freq: 80, freqEnd: 30, dur: 0.4, vol: 0.2 });
    }, 50);
  }

  countdown() {
    this._play({ wave: 'sine', freq: 660, dur: 0.12, vol: 0.2 });
  }

  go() {
    this._play({ wave: 'sine', freq: 880, freqEnd: 1100, dur: 0.2, vol: 0.3 });
  }
}

// Singleton
export const soundManager = new SoundManager();