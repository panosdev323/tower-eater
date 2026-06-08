/**
 * SoundManager — Web Audio synthesis, no dependencies.
 *
 * Each event uses a different synthesis technique so they sound
 * clearly distinct from one another:
 *
 *  move        → short pitched blip (sine, tiny pitch rise)
 *  shoot       → filtered noise burst + pitched tail
 *  hit         → noise thud + low sub punch
 *  eatTower    → fm chime chord (2 carriers)
 *  unlockBase  → 3-osc major fanfare with reverb tail
 *  win         → pentatonic arpeggio + shimmer layer
 *  death       → detuned saw cluster, pitch falls to nothing
 *  freeze      → high-pass ice crackle (noise + ring mod)
 *  grenade     → sub boom + distorted mid crunch
 *  countdown   → clean sine tick
 *  go          → bright synth stab
 */

export class SoundManager {
  constructor() {
    this.soundsOn = this._load('te_sounds', true);
    this.musicOn  = this._load('te_music',  false);
    this._ctx     = null;
  }

  // ── Persistence ───────────────────────────────────────────────────

  _load(key, def) {
    const v = localStorage.getItem(key);
    return v === null ? def : v === 'true';
  }
  _save(key, val) { localStorage.setItem(key, String(val)); }

  setSounds(on) { this.soundsOn = on; this._save('te_sounds', on); }
  setMusic(on)  { this.musicOn  = on; this._save('te_music',  on); }

  // ── AudioContext (lazy) ───────────────────────────────────────────

  get ctx() {
    if (!this._ctx)
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this._ctx;
  }

  // ── Low-level helpers ─────────────────────────────────────────────

  /** Create an oscillator already connected to a gain node → master out */
  _osc(type, freq, gainNode) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.connect(gainNode);
    return o;
  }

  /** Create a gain node connected to master out */
  _gain(val, dest) {
    const g = this.ctx.createGain();
    g.gain.value = val;
    g.connect(dest || this.ctx.destination);
    return g;
  }

  /** White-noise buffer (mono, 0.5s) — reused across calls */
  _noiseBuffer() {
    if (this._nb) return this._nb;
    const len = this.ctx.sampleRate * 0.5;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this._nb = buf;
    return buf;
  }

  /** Play a noise burst through an optional filter */
  _noise(opts = {}) {
    const src    = this.ctx.createBufferSource();
    src.buffer   = this._noiseBuffer();
    const filter = this.ctx.createBiquadFilter();
    filter.type            = opts.filterType  ?? 'bandpass';
    filter.frequency.value = opts.filterFreq  ?? 1000;
    filter.Q.value         = opts.filterQ     ?? 1;
    const g = this._gain(0, this.ctx.destination);
    const now = this.ctx.currentTime;
    g.gain.setValueAtTime(opts.vol ?? 0.3, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (opts.dur ?? 0.15));
    src.connect(filter);
    filter.connect(g);
    src.start(now);
    src.stop(now + (opts.dur ?? 0.15) + 0.02);
    return { src, filter, gain: g };
  }

  /** Simple envelope on a gain node: attack → peak → decay to 0 */
  _env(gainNode, peak, attack, decay, startTime) {
    const g = gainNode.gain;
    g.setValueAtTime(0, startTime);
    g.linearRampToValueAtTime(peak, startTime + attack);
    g.exponentialRampToValueAtTime(0.0001, startTime + attack + decay);
  }

  /** Waveshaper distortion curve */
  _distCurve(amount = 80) {
    const n = 256, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  // ── Guard ─────────────────────────────────────────────────────────

  _guard() {
    if (!this.soundsOn) return false;
    // Resume suspended context (autoplay policy)
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  // ═════════════════════════════════════════════════════════════════
  // Sound effects
  // ═════════════════════════════════════════════════════════════════

  /**
   * move — a tiny sine blip, very short, low volume.
   * Technique: single sine osc, quick pitch micro-rise.
   */
  move() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;
    const g   = this._gain(0, this.ctx.destination);
    const o   = this._osc('sine', 260, g);
    o.frequency.setValueAtTime(260, now);
    o.frequency.linearRampToValueAtTime(310, now + 0.06);
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    o.start(now); o.stop(now + 0.08);
  }

  /**
   * shoot — filtered noise "whoosh" + a descending square tail.
   * Technique: bandpass noise burst layered with a square osc.
   */
  shoot() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    // Noise whoosh
    this._noise({ filterType: 'highpass', filterFreq: 2200, filterQ: 0.8,
                  vol: 0.18, dur: 0.12 });

    // Pitch tail
    const g = this._gain(0, this.ctx.destination);
    const o = this._osc('square', 320, g);
    o.frequency.setValueAtTime(320, now);
    o.frequency.exponentialRampToValueAtTime(110, now + 0.14);
    g.gain.setValueAtTime(0.1, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    o.start(now); o.stop(now + 0.15);
  }

  /**
   * hit — low thud: sub sine punch + mid noise smack.
   * Technique: very low sine (sub punch) + bandpass noise burst.
   */
  hit() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    // Sub punch
    const g1 = this._gain(0, this.ctx.destination);
    const o1 = this._osc('sine', 90, g1);
    o1.frequency.setValueAtTime(90, now);
    o1.frequency.exponentialRampToValueAtTime(35, now + 0.18);
    g1.gain.setValueAtTime(0.45, now);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o1.start(now); o1.stop(now + 0.2);

    // Mid smack noise
    this._noise({ filterType: 'bandpass', filterFreq: 900, filterQ: 1.2,
                  vol: 0.3, dur: 0.1 });

    // Brief camera-rumble feel: distorted low osc
    const dist = this.ctx.createWaveShaper();
    dist.curve = this._distCurve(120);
    const g2 = this._gain(0, this.ctx.destination);
    const o2 = this._osc('sawtooth', 55, dist);
    dist.connect(g2);
    g2.gain.setValueAtTime(0.15, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o2.start(now); o2.stop(now + 0.13);
  }

  /**
   * eatTower — FM chime: two carriers with modulator, rising shimmer.
   * Technique: FM synthesis (modulator → frequency of carrier).
   */
  eatTower() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    const playFMChime = (freq, startT, vol) => {
      const modFreq = freq * 2.5;
      const modGain = this.ctx.createGain();
      modGain.gain.value = freq * 4;
      const mod = this.ctx.createOscillator();
      mod.type = 'sine';
      mod.frequency.value = modFreq;

      const car = this.ctx.createOscillator();
      car.type = 'sine';
      car.frequency.value = freq;

      const out = this._gain(0, this.ctx.destination);
      mod.connect(modGain);
      modGain.connect(car.frequency);
      car.connect(out);

      out.gain.setValueAtTime(0, startT);
      out.gain.linearRampToValueAtTime(vol, startT + 0.02);
      out.gain.exponentialRampToValueAtTime(0.0001, startT + 0.55);

      mod.start(startT); mod.stop(startT + 0.56);
      car.start(startT); car.stop(startT + 0.56);
    };

    playFMChime(440, now,        0.28);
    playFMChime(554, now + 0.1,  0.22);
    playFMChime(659, now + 0.2,  0.18);
  }

  /**
   * unlockBase — 3-voice major chord stab + bright shimmer.
   * Technique: 3 detuned triangle oscs + high sine shimmer layer.
   */
  unlockBase() {
    if (!this._guard()) return;
    const now   = this.ctx.currentTime;
    const freqs = [523, 659, 784]; // C5 E5 G5

    freqs.forEach((f, i) => {
      const g = this._gain(0, this.ctx.destination);
      const o = this._osc('triangle', f, g);
      // slight detune per voice
      o.detune.value = (i - 1) * 6;
      const t = now + i * 0.04;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.start(t); o.stop(t + 0.72);
    });

    // High shimmer
    const gs = this._gain(0, this.ctx.destination);
    const os = this._osc('sine', 1568, gs); // G6
    gs.gain.setValueAtTime(0, now + 0.05);
    gs.gain.linearRampToValueAtTime(0.12, now + 0.12);
    gs.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    os.start(now + 0.05); os.stop(now + 0.92);
  }

  /**
   * win — pentatonic arpeggio + rising saw pad.
   * Technique: timed sine notes + detuned saw chord.
   */
  win() {
    if (!this._guard()) return;
    const now   = this.ctx.currentTime;
    const notes = [523, 659, 784, 988, 1047]; // C E G B C

    notes.forEach((f, i) => {
      const t = now + i * 0.11;
      const g = this._gain(0, this.ctx.destination);
      const o = this._osc('sine', f, g);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.start(t); o.stop(t + 0.37);
    });

    // Rising saw pad underneath
    [261, 329, 392].forEach((f, i) => {
      const g = this._gain(0, this.ctx.destination);
      const o = this._osc('sawtooth', f, g);
      o.detune.value = i * 8;
      // Low-pass filter to soften
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 800;
      o.disconnect(); o.connect(lp); lp.connect(g);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.07, now + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      o.start(now); o.stop(now + 0.72);
    });
  }

  /**
   * death — detuned sawtooth cluster that pitches down and dies.
   * Technique: 3 detuned saws + pitch envelope fall + noise tail.
   */
  death() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    // 3 detuned saws collapsing
    [-15, 0, 15].forEach(detune => {
      const g = this._gain(0, this.ctx.destination);
      const o = this._osc('sawtooth', 280, g);
      o.detune.value = detune;
      o.frequency.setValueAtTime(280, now);
      o.frequency.exponentialRampToValueAtTime(55, now + 0.7);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      o.start(now); o.stop(now + 0.77);
    });

    // Low sub fall
    const gs = this._gain(0, this.ctx.destination);
    const os = this._osc('sine', 120, gs);
    os.frequency.setValueAtTime(120, now);
    os.frequency.exponentialRampToValueAtTime(28, now + 0.6);
    gs.gain.setValueAtTime(0.35, now);
    gs.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    os.start(now); os.stop(now + 0.67);

    // Final noise whomp
    this._noise({ filterType: 'lowpass', filterFreq: 400, filterQ: 0.5,
                  vol: 0.25, dur: 0.4 });
  }

  /**
   * freeze — ice crackle: highpass noise + ring modulation shimmer.
   * Technique: noise → highpass + sine ring mod at high frequency.
   */
  freeze() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    // Ice crackle noise
    this._noise({ filterType: 'highpass', filterFreq: 4000, filterQ: 2,
                  vol: 0.22, dur: 0.28 });

    // Ring-mod shimmer: carrier × modulator
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(1200, now);
    carrier.frequency.exponentialRampToValueAtTime(600, now + 0.3);

    const ringMod = this.ctx.createOscillator();
    ringMod.type = 'sine';
    ringMod.frequency.value = 30; // tremolo rate

    const ringGain = this.ctx.createGain();
    ringGain.gain.value = 1;
    ringMod.connect(ringGain.gain); // amplitude modulate

    const out = this._gain(0, this.ctx.destination);
    carrier.connect(ringGain);
    ringGain.connect(out);
    out.gain.setValueAtTime(0.15, now);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    carrier.start(now); carrier.stop(now + 0.36);
    ringMod.start(now); ringMod.stop(now + 0.36);
  }

  /**
   * grenade — sub boom + mid crunch + noise smear.
   * Technique: sine sub + distorted saw + lowpass noise.
   */
  grenade() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    // Sub boom
    const g1 = this._gain(0, this.ctx.destination);
    const o1 = this._osc('sine', 80, g1);
    o1.frequency.setValueAtTime(80, now);
    o1.frequency.exponentialRampToValueAtTime(22, now + 0.45);
    g1.gain.setValueAtTime(0.5, now);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    o1.start(now); o1.stop(now + 0.47);

    // Distorted mid crunch
    const dist = this.ctx.createWaveShaper();
    dist.curve = this._distCurve(200);
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1800;
    const g2 = this._gain(0, this.ctx.destination);
    const o2 = this._osc('sawtooth', 160, dist);
    dist.connect(lp); lp.connect(g2);
    g2.gain.setValueAtTime(0.25, now + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    o2.start(now + 0.02); o2.stop(now + 0.37);

    // Noise smear
    this._noise({ filterType: 'lowpass', filterFreq: 600, filterQ: 0.7,
                  vol: 0.3, dur: 0.35 });
  }

  /**
   * countdown — clean sine tick, neutral.
   */
  countdown() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;
    const g   = this._gain(0, this.ctx.destination);
    const o   = this._osc('sine', 880, g);
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    o.start(now); o.stop(now + 0.11);
  }

  /**
   * go — bright synth stab: two detuned saws + bandpass filter sweep.
   * Technique: 2 saws → bandpass with cutoff sweep.
   */
  go() {
    if (!this._guard()) return;
    const now = this.ctx.currentTime;

    [0, 7].forEach(detune => {
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(400, now);
      bp.frequency.exponentialRampToValueAtTime(2200, now + 0.18);
      bp.Q.value = 2;

      const g = this._gain(0, this.ctx.destination);
      const o = this._osc('sawtooth', 220, bp);
      o.detune.value = detune;
      bp.connect(g);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      o.start(now); o.stop(now + 0.24);
    });
  }
}

// Singleton
export const soundManager = new SoundManager();