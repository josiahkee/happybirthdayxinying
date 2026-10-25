/* =====================================================================
 *  Xin Ying's Birthday Website Logic
 *  Plain JavaScript, zero dependencies. All text is in content.js.
 * ===================================================================== */
(() => {
  'use strict';

  const C = window.BIRTHDAY_CONFIG;
  if (!C) { document.body.textContent = 'content.js failed to load.'; return; }

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const params = new URLSearchParams(location.search);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BIRTHDAY = Date.parse(C.birthday);
  const AGE = C.age || 17;
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  const fmtClock = s => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
  function fmtDur(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    return (d ? `${d}d ` : '') + `${pad(h)}:${pad(m)}:${pad(sec)}`;
  }

  // ---------- Saved progress (localStorage) ----------
  const STORE_KEY = 'xinying-bday-30oct';
  const storage = {
    get() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; } },
    set(v) { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch { /* ignore */ } },
    clear() { try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ } },
  };
  if (params.has('reset')) storage.clear();
  const state = Object.assign({ opened: [], score: 0, candlesOut: false, sfx: true }, storage.get());
  const save = () => storage.set(state);

  function toast(msg, ms = 3000) {
    const t = el('div', 'toast', msg);
    $('#toasts').append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 260); }, ms);
  }

  /* ===================================================================
   *  CLEAN PIXEL ILLUSTRATIONS, STICKERS & FENCING ART
   * =================================================================== */
  const PIXEL_ICONS = {
    envelope: `<svg viewBox="0 0 28 24" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="3" y="4" width="22" height="16" fill="#2C4C70"/>
      <rect x="4" y="5" width="20" height="14" fill="#FFFFFF"/>
      <rect x="4" y="15" width="20" height="4" fill="#EEF5FE"/>
      <rect x="5" y="6" width="2" height="2" fill="#BFD9F6"/>
      <rect x="7" y="8" width="2" height="2" fill="#BFD9F6"/>
      <rect x="9" y="10" width="2" height="2" fill="#BFD9F6"/>
      <rect x="21" y="6" width="2" height="2" fill="#BFD9F6"/>
      <rect x="19" y="8" width="2" height="2" fill="#BFD9F6"/>
      <rect x="17" y="10" width="2" height="2" fill="#BFD9F6"/>
      <rect x="11" y="9" width="2" height="1" fill="#54A6F7"/>
      <rect x="15" y="9" width="2" height="1" fill="#54A6F7"/>
      <rect x="10" y="10" width="8" height="2" fill="#54A6F7"/>
      <rect x="11" y="12" width="6" height="1" fill="#54A6F7"/>
      <rect x="12" y="13" width="4" height="1" fill="#54A6F7"/>
      <rect x="13" y="14" width="2" height="1" fill="#54A6F7"/>
    </svg>`,
    foils: `<svg viewBox="0 0 28 28" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="4" y="22" width="3" height="2" fill="#2C4C70"/>
      <rect x="6" y="20" width="2" height="2" fill="#2C4C70"/>
      <rect x="6" y="17" width="5" height="2" fill="#E0B24C"/>
      <rect x="8" y="16" width="3" height="4" fill="#E0B24C"/>
      <rect x="10" y="15" width="2" height="2" fill="#54A6F7"/>
      <rect x="12" y="13" width="2" height="2" fill="#54A6F7"/>
      <rect x="14" y="11" width="2" height="2" fill="#54A6F7"/>
      <rect x="16" y="9" width="2" height="2" fill="#54A6F7"/>
      <rect x="18" y="7" width="2" height="2" fill="#54A6F7"/>
      <rect x="20" y="5" width="2" height="2" fill="#54A6F7"/>
      <rect x="22" y="4" width="2" height="2" fill="#9ED0FC"/>
      <rect x="21" y="22" width="3" height="2" fill="#2C4C70"/>
      <rect x="20" y="20" width="2" height="2" fill="#2C4C70"/>
      <rect x="17" y="17" width="5" height="2" fill="#E0B24C"/>
      <rect x="17" y="16" width="3" height="4" fill="#E0B24C"/>
      <rect x="16" y="15" width="2" height="2" fill="#54A6F7"/>
      <rect x="14" y="13" width="2" height="2" fill="#2C4C70"/>
      <rect x="12" y="11" width="2" height="2" fill="#54A6F7"/>
      <rect x="10" y="9" width="2" height="2" fill="#54A6F7"/>
      <rect x="8" y="7" width="2" height="2" fill="#54A6F7"/>
      <rect x="6" y="5" width="2" height="2" fill="#54A6F7"/>
      <rect x="4" y="4" width="2" height="2" fill="#9ED0FC"/>
    </svg>`,
    album: `<svg viewBox="0 0 28 28" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="7" y="3" width="16" height="19" fill="#BFD9F6"/>
      <rect x="5" y="5" width="16" height="20" fill="#2C4C70"/>
      <rect x="6" y="6" width="14" height="18" fill="#FFFFFF"/>
      <rect x="8" y="8" width="10" height="11" fill="#54A6F7"/>
      <rect x="8" y="15" width="10" height="4" fill="#8AC5FA"/>
      <rect x="14" y="10" width="2" height="2" fill="#FFFBEB"/>
      <rect x="9" y="21" width="8" height="1" fill="#BFD9F6"/>
    </svg>`,
    heart: `<svg viewBox="0 0 28 28" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="6" y="6" width="5" height="2" fill="#2C4C70"/>
      <rect x="17" y="6" width="5" height="2" fill="#2C4C70"/>
      <rect x="4" y="8" width="20" height="6" fill="#2C4C70"/>
      <rect x="6" y="14" width="16" height="3" fill="#2C4C70"/>
      <rect x="8" y="17" width="12" height="2" fill="#2C4C70"/>
      <rect x="10" y="19" width="8" height="2" fill="#2C4C70"/>
      <rect x="12" y="21" width="4" height="2" fill="#2C4C70"/>
      <rect x="6" y="8" width="6" height="2" fill="#54A6F7"/>
      <rect x="16" y="8" width="6" height="2" fill="#54A6F7"/>
      <rect x="5" y="10" width="18" height="4" fill="#54A6F7"/>
      <rect x="7" y="14" width="14" height="3" fill="#54A6F7"/>
      <rect x="9" y="17" width="10" height="2" fill="#54A6F7"/>
      <rect x="11" y="19" width="6" height="2" fill="#54A6F7"/>
      <rect x="13" y="21" width="2" height="1" fill="#54A6F7"/>
      <rect x="7" y="9" width="3" height="2" fill="#FFFFFF"/>
    </svg>`,
  };

  const STICKERS = {
    heart: `<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M3 3h3v1h1v1h2V4h1V3h3v1h1v4h-1v2h-2v2H9v1H7v-1H5v-2H3V8H2V4h1V3z" fill="#54A6F7"/><rect x="4" y="4" width="2" height="1" fill="#FFFFFF"/></svg>`,
    star: `<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="7" y="1" width="2" height="14" fill="#E0B24C"/><rect x="1" y="7" width="14" height="2" fill="#E0B24C"/><rect x="4" y="4" width="8" height="8" fill="#F7D77E"/><rect x="6" y="6" width="4" height="4" fill="#FFFFFF"/></svg>`,
    sparkle: `<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="7" y="2" width="2" height="12" fill="#54A6F7"/><rect x="2" y="7" width="12" height="2" fill="#54A6F7"/><rect x="5" y="5" width="6" height="6" fill="#9ED0FC"/><rect x="7" y="7" width="2" height="2" fill="#FFFFFF"/></svg>`,
    yoyo: `<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="5" y="2" width="6" height="12" fill="#2C4C70"/><rect x="2" y="5" width="12" height="6" fill="#2C4C70"/><rect x="4" y="4" width="8" height="8" fill="#54A6F7"/><rect x="6" y="6" width="4" height="4" fill="#FFFFFF"/><rect x="7" y="7" width="2" height="2" fill="#E0B24C"/></svg>`,
  };

  const LOCK_SVG = `<svg class="tile-lock" viewBox="0 0 28 28" shape-rendering="crispEdges" aria-hidden="true">
    <rect x="10" y="4" width="8" height="2" fill="#7898BC"/>
    <rect x="8" y="6" width="2" height="6" fill="#7898BC"/>
    <rect x="18" y="6" width="2" height="6" fill="#7898BC"/>
    <rect x="6" y="11" width="16" height="13" fill="#2C4C70"/>
    <rect x="7" y="12" width="14" height="11" fill="#DCEBFC"/>
    <rect x="7" y="12" width="14" height="2" fill="#FFFFFF"/>
    <rect x="12" y="16" width="4" height="2" fill="#54A6F7"/>
    <rect x="13" y="18" width="2" height="3" fill="#54A6F7"/>
  </svg>`;

  const FOIL_SVG = `<svg viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
    <rect x="0" y="9" width="36" height="5" rx="1" fill="#2C4C70"/>
    <path d="M36 4 C43 4 46 8 46 11.5 C46 15 43 19 36 19 Z" fill="#E0B24C" stroke="#2C4C70" stroke-width="1.5"/>
    <rect x="46" y="10.5" width="150" height="2.2" fill="#54A6F7"/>
  </svg>`;

  function fencerSvg(accent, trim) {
    return `<svg viewBox="0 0 220 98" fill="none" aria-hidden="true">
      <path d="M44 37 L24 44 L17 31" stroke="#2C4C70" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M44 37 L24 44 L17 31" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45 58 L30 74 L22 90" stroke="#2C4C70" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M45 58 L30 74 L22 90" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M51 58 L70 70 L76 90" stroke="#2C4C70" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M51 58 L70 70 L76 90" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="16" y="88" width="12" height="5" rx="2" fill="${accent}" stroke="#2C4C70" stroke-width="1.5"/>
      <rect x="72" y="88" width="13" height="5" rx="2" fill="${accent}" stroke="#2C4C70" stroke-width="1.5"/>
      <path d="M40 31 L56 31 L54 59 L42 59 Z" fill="#FFFFFF" stroke="#2C4C70" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M45 34 L53 34 L52 46 L45 46 Z" fill="${trim}"/>
      <path d="M54 36 L75 39 L94 35" stroke="#2C4C70" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M54 36 L75 39 L94 35" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="49" cy="19" rx="9.5" ry="11" fill="${accent}" stroke="#2C4C70" stroke-width="2.2"/>
      <ellipse cx="52" cy="19" rx="5.5" ry="7.5" fill="#1C2D42"/>
      <path d="M49 15 H55 M49 19 H56 M49 23 H55" stroke="${trim}" stroke-width="1" opacity="0.65"/>
      <path d="M95 27 C101 27 103 31 103 35 C103 39 101 43 95 43 Z" fill="#E0B24C" stroke="#2C4C70" stroke-width="1.6"/>
      <line x1="103" y1="35" x2="212" y2="35" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="213" cy="35" r="2.2" fill="#E0B24C"/>
    </svg>`;
  }

  function makeTileIcon(card) {
    const wrap = el('span', 'tile-icon');
    if (card.iconKey === 'compass') {
      const img = el('img', 'compass-img');
      img.src = C.compassImage || 'photos/compass.jpg';
      img.alt = '';
      wrap.style.borderRadius = '50%';
      wrap.style.overflow = 'hidden';
      wrap.style.border = '2px solid #2C4C70';
      wrap.style.background = '#FFFFFF';
      wrap.append(img);
      return wrap;
    }
    wrap.innerHTML = PIXEL_ICONS[card.iconKey] || PIXEL_ICONS.envelope;
    return wrap;
  }

  /* ===================================================================
   *  SILENT CLOCK SYNC
   * =================================================================== */
  const Time = {
    offset: 0,
    realOffset: 0,
    now() { return Date.now() + this.offset; },
    async sync() {
      if (params.get('debug') === 'birthday') {
        this.offset = BIRTHDAY + 2000 - Date.now();
        return;
      }
      const fake = params.get('now');
      if (fake && !isNaN(Date.parse(fake))) {
        this.offset = Date.parse(fake) - Date.now();
        return;
      }
      const accept = t => {
        if (isNaN(t)) return false;
        const off = t - Date.now();
        this.offset = this.realOffset = Math.abs(off) < 5000 ? 0 : off;
        return true;
      };
      if (location.protocol.startsWith('http')) {
        try {
          const t0 = Date.now();
          const r = await withTimeout(fetch(location.pathname, { method: 'HEAD', cache: 'no-store' }), 2200);
          const d = r.headers.get('date');
          if (d && accept(Date.parse(d) + (Date.now() - t0) / 2)) return;
        } catch { /* fallback */ }
      }
      try {
        const r = await withTimeout(fetch('https://worldtimeapi.org/api/timezone/Asia/Singapore', { cache: 'no-store' }), 2200);
        const j = await r.json();
        if (accept(Date.parse(j.utc_datetime || j.datetime))) return;
      } catch { /* fallback */ }
    },
  };

  /* ===================================================================
   *  AUDIO ENGINE + SOUND EFFECTS
   * =================================================================== */
  const AudioEngine = {
    ctx: null, music: null, sfx: null, analyser: null, _noise: null,
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        this.music = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.music.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.sfx = this.ctx.createGain();
        this.sfx.gain.value = 0.85;
        this.sfx.connect(this.ctx.destination);
        Player.applyVol();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    noiseBuf() {
      if (!this._noise) {
        const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        this._noise = b;
      }
      return this._noise;
    },
  };

  let lastScratchSfx = 0;
  const SFX = {
    ready() { return state.sfx && AudioEngine.ensure(); },
    tone(f, t, d, type = 'sine', v = 0.14) {
      const ctx = AudioEngine.ctx, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(AudioEngine.sfx);
      o.start(t); o.stop(t + d + 0.05);
    },
    noise(t, d, { type = 'bandpass', freq = 3000, q = 1, v = 0.35 } = {}) {
      const ctx = AudioEngine.ctx, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = AudioEngine.noiseBuf();
      f.type = type; f.frequency.value = freq; f.Q.value = q;
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      src.connect(f); f.connect(g); g.connect(AudioEngine.sfx);
      src.start(t); src.stop(t + d + 0.05);
    },
    clash() {
      if (!this.ready()) return;
      const t = AudioEngine.ctx.currentTime;
      this.noise(t, 0.11, { freq: 4500, q: 0.7, v: 0.48 });
      [2350, 3720, 5180, 6900].forEach((f, i) => this.tone(f, t, 0.46 - i * 0.07, 'sine', 0.05));
    },
    unlock() {
      if (!this.ready()) return;
      const t = AudioEngine.ctx.currentTime;
      this.tone(659.25, t, 0.11, 'triangle', 0.14);
      this.tone(987.77, t + 0.08, 0.14, 'triangle', 0.14);
      this.tone(1318.5, t + 0.16, 0.25, 'triangle', 0.12);
    },
    deny() {
      if (!this.ready()) return;
      const t = AudioEngine.ctx.currentTime;
      this.tone(220, t, 0.1, 'triangle', 0.08);
      this.tone(165, t + 0.1, 0.15, 'triangle', 0.08);
    },
    pop(idx = 0) {
      if (!this.ready()) return;
      const ctx = AudioEngine.ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      const base = 380 + (idx % 6) * 55;
      o.type = 'sine';
      o.frequency.setValueAtTime(base, t);
      o.frequency.exponentialRampToValueAtTime(base * 2.1, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      o.connect(g); g.connect(AudioEngine.sfx);
      o.start(t); o.stop(t + 0.12);
    },
    tick() {
      if (!this.ready()) return;
      this.tone(1100 + Math.random() * 250, AudioEngine.ctx.currentTime, 0.025, 'triangle', 0.06);
    },
    scratch() {
      const now = performance.now();
      if (now - lastScratchSfx < 65 || !this.ready()) return;
      lastScratchSfx = now;
      this.noise(AudioEngine.ctx.currentTime, 0.045, { type: 'bandpass', freq: 2400, q: 1.2, v: 0.12 });
    },
    firework() {
      if (!this.ready()) return;
      const t = AudioEngine.ctx.currentTime;
      this.noise(t, 0.18, { type: 'bandpass', freq: 1800, q: 0.8, v: 0.25 });
      [587.33, 880, 1174.66].forEach((f, i) => this.tone(f, t + 0.05 + i * 0.05, 0.25, 'triangle', 0.11));
    },
    puff() {
      if (!this.ready()) return;
      this.noise(AudioEngine.ctx.currentTime, 0.32, { type: 'lowpass', freq: 900, q: 0.5, v: 0.42 });
    },
    fanfare() {
      if (!this.ready()) return;
      const t = AudioEngine.ctx.currentTime, n = [523.25, 659.25, 783.99, 1046.5];
      n.forEach((f, i) => this.tone(f, t + i * 0.11, 0.3, 'triangle', 0.17));
      n.forEach(f => this.tone(f, t + 0.5, 1.2, 'triangle', 0.085));
    },
    yoyo() {
      if (!this.ready()) return;
      const ctx = AudioEngine.ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(760, t);
      o.frequency.exponentialRampToValueAtTime(290, t + 0.26);
      o.frequency.exponentialRampToValueAtTime(860, t + 0.55);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.13, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(g); g.connect(AudioEngine.sfx);
      o.start(t); o.stop(t + 0.64);
    },
    click() { if (this.ready()) this.tone(1400, AudioEngine.ctx.currentTime, 0.03, 'sine', 0.04); },
    key() { if (this.ready()) this.tone(1950 + Math.random() * 350, AudioEngine.ctx.currentTime, 0.02, 'square', 0.012); },
  };

  /* ===================================================================
   *  FALLBACK BIRTHDAY SYNTH
   * =================================================================== */
  const NOTE = {
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  };
  const HB_EVENTS = (() => {
    const seq = [
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
    ];
    const beat = 0.48, ev = [];
    let b = 0;
    for (const [n, len] of seq) {
      const st = b * beat, d = len * beat * 0.92;
      ev.push([st, d, NOTE[n], 'triangle', 0.1], [st, d, NOTE[n] / 2, 'sine', 0.08]);
      b += len;
    }
    return { events: ev, duration: b * beat + 0.4 };
  })();

  const Synth = {
    nodes: [], running: false, offset: 0, startedAt: 0, timer: 0, onEnd: null,
    get duration() { return HB_EVENTS.duration; },
    start(offset = 0) {
      this.stop();
      const ctx = AudioEngine.ensure();
      if (!ctx) return;
      const { events, duration } = HB_EVENTS;
      const t0 = ctx.currentTime + 0.05;
      this.offset = offset; this.startedAt = t0 - offset;
      for (const [st, d, f, type, v] of events) {
        if (st + 0.001 < offset) continue;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + st - offset);
        g.gain.exponentialRampToValueAtTime(v, t0 + st - offset + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + st - offset + d);
        o.connect(g); g.connect(AudioEngine.music);
        o.start(t0 + st - offset); o.stop(t0 + st - offset + d + 0.06);
        this.nodes.push(o);
      }
      this.running = true;
      this.timer = setTimeout(() => { this.running = false; this.offset = 0; if (this.onEnd) this.onEnd(); }, Math.max(50, (duration - offset) * 1000));
    },
    stop() {
      clearTimeout(this.timer);
      this.nodes.forEach(o => { try { o.stop(); } catch { /* ignore */ } });
      this.nodes = []; this.running = false;
    },
    position() { return this.running ? clamp(AudioEngine.ctx.currentTime - this.startedAt, 0, this.duration) : this.offset; },
  };

  /* ===================================================================
   *  STRAY KIDS COMPASS MUSIC PLAYER
   * =================================================================== */
  const ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
  const isSynth = t => t && String(t.src || '').startsWith('synth:');

  const Player = {
    tracks: [], i: 0, audio: new Audio(), playing: false, connected: false, vol: 0.8, seeking: false, loading: null,
    init() {
      this.tracks = (C.playlist || []).map(t => ({ ...t }))
        .concat([{ title: `Happy Birthday, ${C.name}!`, artist: 'Music Box', src: 'synth:hbd' }]);
      this.hbdIndex = this.tracks.length - 1;
      this.audio.preload = 'metadata';
      this.audio.addEventListener('ended', () => this.next(true));
      this.audio.addEventListener('error', () => { if (this.audio.getAttribute('src')) this.fail(this.loading); });
      Synth.onEnd = () => { if (this.playing && isSynth(this.cur())) this.next(true); };

      $('#pPlay').addEventListener('click', () => this.toggle());
      $('#discBtn').addEventListener('click', () => this.toggle());
      $('#pNext').addEventListener('click', () => this.next(false));
      $('#pPrev').addEventListener('click', () => this.prev());
      $('#pMore').addEventListener('click', e => { e.stopPropagation(); $('#pPanel').hidden = !$('#pPanel').hidden; });
      document.addEventListener('click', e => { if (!$('#player').contains(e.target)) $('#pPanel').hidden = true; });
      const seek = $('#pSeek');
      seek.addEventListener('input', () => { this.seeking = true; });
      seek.addEventListener('change', () => { this.seekTo(seek.value / 1000); this.seeking = false; });
      $('#pVol').addEventListener('input', e => { this.vol = e.target.value / 100; this.applyVol(); });
      $('#pSfx').checked = state.sfx;
      $('#pSfx').addEventListener('change', e => { state.sfx = e.target.checked; save(); });
      if (C.externalPlaylistUrl) $('#pExt').href = C.externalPlaylistUrl; else $('#pExt').hidden = true;

      this.load(0);
      this.loop();
    },
    async probe() {
      if (!location.protocol.startsWith('http')) return;
      await Promise.all(this.tracks.map(async t => {
        if (isSynth(t)) return;
        try {
          const r = await withTimeout(fetch(t.src, { method: 'HEAD', cache: 'no-store' }), 1500);
          if (!r.ok) t.streamOnly = true;
        } catch {
          t.streamOnly = true;
        }
      }));
      if (this.cur()?.streamOnly && !this.playing) this.load(this.firstPlayable());
      else this.renderList();
    },
    firstPlayable() {
      const idx = this.tracks.findIndex(t => !t.streamOnly);
      return idx >= 0 ? idx : this.hbdIndex;
    },
    cur() { return this.tracks[this.i]; },
    load(i) {
      this.audio.pause(); Synth.stop(); Synth.offset = 0;
      this.playing = false;
      this.i = (i + this.tracks.length) % this.tracks.length;
      const t = this.cur();
      this.loading = t;
      if (isSynth(t) || t.streamOnly) this.audio.removeAttribute('src');
      else this.audio.src = t.src;
      $('#pTitle').textContent = t.title;
      $('#pArtist').textContent = t.artist || '';
      this.renderList(); this.ui();
    },
    connect() {
      if (this.connected || !location.protocol.startsWith('http') || !AudioEngine.ctx) return;
      try {
        AudioEngine.ctx.createMediaElementSource(this.audio).connect(AudioEngine.music);
        this.connected = true; this.applyVol();
      } catch { /* fallback */ }
    },
    applyVol() {
      if (AudioEngine.music) AudioEngine.music.gain.value = this.vol;
      this.audio.volume = this.connected ? 1 : this.vol;
    },
    play() {
      AudioEngine.ensure();
      const t = this.cur();
      if (t.streamOnly) {
        this.load(this.firstPlayable());
        return this.play();
      }
      this.playing = true;
      if (isSynth(t)) Synth.start(Synth.offset);
      else {
        this.connect();
        this.audio.play().catch(err => {
          if (err.name === 'NotAllowedError') { this.playing = false; this.ui(); }
          else if (err.name !== 'AbortError') this.fail(t);
        });
      }
      this.ui();
    },
    pause() {
      this.playing = false;
      if (isSynth(this.cur())) { Synth.offset = Synth.position(); Synth.stop(); } else this.audio.pause();
      this.ui();
    },
    toggle() { this.playing ? this.pause() : this.play(); },
    fail(t) {
      if (!t || t.streamOnly || isSynth(t)) return;
      t.streamOnly = true;
      this.renderList();
      if (this.cur() === t) this.next(false, true);
    },
    nextIndex(step) {
      let j = this.i;
      for (let k = 0; k < this.tracks.length; k++) {
        j = (j + step + this.tracks.length) % this.tracks.length;
        if (!this.tracks[j].streamOnly) return j;
      }
      return this.hbdIndex;
    },
    next(auto, forcePlay) {
      const resume = forcePlay ?? (this.playing || auto);
      this.load(this.nextIndex(1));
      if (resume) this.play();
    },
    prev() {
      if (this.pos() > 3) { this.seekTo(0); return; }
      const resume = this.playing;
      this.load(this.nextIndex(-1));
      if (resume) this.play();
    },
    playIndex(i) {
      const t = this.tracks[i];
      if (!t) return;
      if (t.streamOnly) {
        if (t.url) window.open(t.url, '_blank', 'noopener');
        return;
      }
      this.load(i);
      this.play();
    },
    pos() { return isSynth(this.cur()) ? Synth.position() : (this.audio.currentTime || 0); },
    dur() { return isSynth(this.cur()) ? Synth.duration : (isFinite(this.audio.duration) ? this.audio.duration : 0); },
    seekTo(frac) {
      const d = this.dur();
      if (!d) return;
      if (isSynth(this.cur())) {
        Synth.offset = frac * d;
        if (this.playing) Synth.start(Synth.offset);
      } else this.audio.currentTime = frac * d;
    },
    renderList() {
      const ol = $('#pTracks');
      ol.replaceChildren();
      this.tracks.forEach((t, idx) => {
        const li = el('li', idx === this.i ? 'active' : '');
        const row = el('div', 'p-track-row');
        const b = el('button', 'p-track-btn');
        b.type = 'button';
        b.append(el('span', null, `${idx + 1}. ${t.title}`));
        b.addEventListener('click', () => this.playIndex(idx));
        row.append(b);
        if (t.url) {
          const a = el('a', 'p-listen', '↗');
          a.href = t.url; a.target = '_blank'; a.rel = 'noopener';
          a.title = `Open ${t.title}`;
          row.append(a);
        }
        li.append(row);
        ol.append(li);
      });
    },
    ui() {
      $('#pPlay').innerHTML = this.playing ? ICON_PAUSE : ICON_PLAY;
      $('#pPlay').setAttribute('aria-label', this.playing ? 'Pause' : 'Play');
      $('#discBtn').classList.toggle('spin', this.playing);
    },
    loop() {
      const cv = $('#viz'), g = cv.getContext('2d'), data = new Uint8Array(128);
      let lastUi = 0;
      const draw = ts => {
        const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
        if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, w, h);
        const real = this.playing && AudioEngine.analyser && (isSynth(this.cur()) || this.connected);
        if (real) AudioEngine.analyser.getByteFrequencyData(data);
        const bars = Math.max(20, Math.floor(w / 10)), bw = w / bars;
        g.fillStyle = '#54A6F7';
        for (let k = 0; k < bars; k++) {
          let v;
          if (real) v = data[Math.floor(k / bars * 90)] / 255;
          else if (this.playing) v = 0.22 + 0.2 * Math.abs(Math.sin(ts / 260 + k * 0.55) * Math.sin(ts / 610 + k * 0.17));
          else v = 0.03;
          const bh = Math.max(2, Math.round((v * h) / 4) * 4);
          g.fillRect(Math.round(k * bw) + 1, h - bh, Math.max(2, Math.floor(bw) - 3), bh);
        }
        if (ts - lastUi > 250) {
          lastUi = ts;
          const p = this.pos(), d = this.dur();
          $('#pCur').textContent = fmtClock(p);
          $('#pDur').textContent = d ? fmtClock(d) : '0:00';
          if (!this.seeking) $('#pSeek').value = d ? Math.round(p / d * 1000) : 0;
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    },
  };

  /* ===================================================================
   *  CONFETTI & SPARKS
   * =================================================================== */
  const FX = {
    cv: null, g: null, parts: [], on: false,
    colors: ['#54A6F7', '#8CC5FA', '#2E7FD4', '#E0B24C', '#F7D77E', '#BBDDFB'],
    init() {
      this.cv = $('#fx'); this.g = this.cv.getContext('2d');
      const resize = () => {
        const d = Math.min(2, devicePixelRatio || 1);
        this.cv.width = innerWidth * d; this.cv.height = innerHeight * d;
        this.g.setTransform(d, 0, 0, d, 0, 0);
      };
      resize(); addEventListener('resize', resize);
    },
    burst(x, y, o = {}) {
      const n = Math.round((o.count ?? 75) * (reduceMotion ? 0.3 : 1));
      for (let i = 0; i < n; i++) {
        const a = (o.angle ?? -Math.PI / 2) + (Math.random() - 0.5) * (o.spread ?? Math.PI * 2);
        const sp = (o.speed ?? 9) * (0.4 + Math.random() * 0.8);
        this.parts.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
          size: o.spark ? 3 : 6 + Math.floor(Math.random() * 3) * 2,
          color: o.spark ? (Math.random() < 0.6 ? '#E0B24C' : '#54A6F7') : this.colors[i % this.colors.length],
          shape: o.spark ? 'spark' : 'rect',
          life: 0, max: o.spark ? 22 + Math.random() * 14 : 150 + Math.random() * 80,
          grav: o.spark ? 0.15 : 0.2, drag: o.spark ? 0.9 : 0.985,
        });
      }
      if (!this.on) { this.on = true; requestAnimationFrame(() => this.step()); }
    },
    sparks(x, y) { this.burst(x, y, { count: 32, speed: 8, spark: true }); },
    cannons() {
      const fire = () => {
        this.burst(0, innerHeight * 0.85, { count: 80, angle: -Math.PI / 3, spread: 0.7, speed: 17 });
        this.burst(innerWidth, innerHeight * 0.85, { count: 80, angle: -2 * Math.PI / 3, spread: 0.7, speed: 17 });
      };
      fire(); setTimeout(fire, 340);
      setTimeout(() => this.burst(innerWidth / 2, innerHeight * 0.35, { count: 100, speed: 11 }), 700);
    },
    step() {
      const g = this.g;
      g.clearRect(0, 0, innerWidth, innerHeight);
      this.parts = this.parts.filter(p => p.life < p.max && p.y < innerHeight + 40);
      for (const p of this.parts) {
        p.life++;
        p.vx = p.vx * p.drag + (p.shape === 'spark' ? 0 : Math.sin(p.life * 0.12 + p.rot) * 0.12);
        p.vy = p.vy * p.drag + p.grav;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        g.globalAlpha = 1 - Math.max(0, (p.life - p.max * 0.7) / (p.max * 0.3));
        g.fillStyle = p.color;
        if (p.shape === 'spark') {
          g.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        } else {
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
          g.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
          g.restore();
        }
      }
      g.globalAlpha = 1;
      if (this.parts.length) requestAnimationFrame(() => this.step());
      else { this.on = false; g.clearRect(0, 0, innerWidth, innerHeight); }
    },
  };
  const centerOf = node => { const r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ===================================================================
   *  OVERLAYS (Modal, Password Modal, Console, Lightbox)
   * =================================================================== */
  const OVERLAY_IDS = ['#modal', '#passModal', '#terminal', '#lightbox'];
  const Overlay = {
    open(id) { $(id).hidden = false; document.body.classList.add('no-scroll'); },
    close(id) {
      $(id).hidden = true;
      if (OVERLAY_IDS.every(s => $(s).hidden)) document.body.classList.remove('no-scroll');
    },
  };
  OVERLAY_IDS.forEach(id => {
    $(id).addEventListener('click', e => {
      if (e.target === $(id) || e.target.closest('[data-close]') || id === '#lightbox') Overlay.close(id);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') OVERLAY_IDS.forEach(id => Overlay.close(id));
    if ((e.key === '`' || e.key === '~') && !['termIn', 'passInput'].includes(document.activeElement?.id)) {
      e.preventDefault(); Term.open();
    }
  });

  function photoEl(src, alt) {
    const img = el('img', 'ph-img');
    img.alt = alt || ''; img.loading = 'lazy'; img.src = src;
    img.addEventListener('error', () => img.replaceWith(el('div', 'ph-img ph-missing', `missing: ${src}`)), { once: true });
    return img;
  }

  function makePolaroidGrid(items, cls = 'album-grid', shouldOpenLightbox = () => true) {
    const grid = el('div', cls);
    const tilts = [-1.6, 2, -1.8, 2.2, -2, 1.5];
    (items || []).forEach((item, i) => {
      const fig = el('button', 'polaroid' + (item.strip ? ' is-strip' : ''));
      fig.type = 'button';
      fig.style.setProperty('--r', tilts[i % tilts.length] + 'deg');
      fig.append(photoEl(item.photo, item.caption), el('figcaption', null, item.caption || ''));
      fig.addEventListener('click', () => {
        if (!shouldOpenLightbox()) return;
        $('#lbMedia').replaceChildren(photoEl(item.photo, item.caption));
        $('#lbCap').textContent = item.caption || '';
        Overlay.open('#lightbox');
      });
      grid.append(fig);
    });
    return grid;
  }

  /* ===================================================================
   *  6 DAILY INTERACTIVE CARD BUILDERS
   * =================================================================== */
  const Cards = {
    head(card) {
      const h = el('div', 'card-head');
      if (card.dateText) h.append(el('span', 'date-pill', card.dateText));
      h.append(el('h3', 'card-title', card.title));
      if (card.subtitle) h.append(el('p', 'card-sub', card.subtitle));
      return h;
    },

    // Fallback plain message
    message(card) {
      const w = el('div');
      w.append(this.head(card), el('div', 'note-card', card.message || ''));
      if (card.note) w.append(el('p', 'card-note', card.note));
      return w;
    },

    // Day 1 (25/10): Xin Ying vs Birthday Blues Fencing Bout
    bout(card) {
      const w = el('div');
      w.append(this.head(card));
      const cheers = card.compliments || ['jiayouu hg', 'im alw here for uuu'];
      const total = cheers.length;
      const piste = el('div', 'piste');
      piste.innerHTML = `<div class="fencer fencer-l">${fencerSvg('#54A6F7', '#CFE4FB')}</div><div class="fencer fencer-r">${fencerSvg('#7E95B2', '#DCE5F0')}</div><div class="clash-flash"></div>`;

      const board = el('div', 'bout-board');
      const me = el('div', 'bout-side'), them = el('div', 'bout-side');
      const lamp = el('span', 'lamp lamp-green'), score = el('b', null, '0');
      me.append(lamp, el('span', null, card.player || C.name), score);
      them.append(el('b', null, '0'), el('span', null, card.opponent || 'Birthday Blues'), el('span', 'lamp lamp-red'));
      board.append(me, them);

      const comp = el('p', 'compliment', 'en garde... ready?');
      const strikeBtn = el('button', 'btn btn-primary', 'Strike!');
      strikeBtn.type = 'button';
      const replayBtn = el('button', 'btn btn-ghost', 'Fence again');
      replayBtn.type = 'button';
      replayBtn.hidden = true;

      const row = el('div', 'card-actions');
      row.style.justifyContent = 'center';
      row.append(strikeBtn, replayBtn);

      let hits = 0;
      strikeBtn.addEventListener('click', () => {
        if (hits >= total) return;
        piste.classList.remove('lunge', 'hit'); void piste.offsetWidth; piste.classList.add('lunge');
        setTimeout(() => {
          piste.classList.add('hit'); SFX.clash();
          FX.sparks(...centerOf(piste));
          hits++; score.textContent = hits;
          lamp.classList.add('on'); setTimeout(() => lamp.classList.remove('on'), 480);
          comp.className = 'compliment'; void comp.offsetWidth; comp.classList.add('show');
          comp.textContent = cheers[hits - 1];
          if (hits >= total) {
            strikeBtn.hidden = true;
            replayBtn.hidden = false;
            setTimeout(() => { SFX.fanfare(); FX.burst(...centerOf(piste), { count: 95, speed: 11 }); }, 340);
          }
        }, 160);
        setTimeout(() => piste.classList.remove('lunge'), 380);
      });

      replayBtn.addEventListener('click', () => {
        hits = 0;
        score.textContent = '0';
        comp.textContent = 'en garde... ready?';
        strikeBtn.hidden = false;
        replayBtn.hidden = true;
        SFX.click();
      });

      w.append(piste, board, comp, row);
      return w;
    },

    // Day 2 (26/10): Message + Spin the SKZ Compass Jukebox
    compassSpin(card) {
      const w = el('div');
      w.append(this.head(card), el('div', 'note-card', card.message || ''));

      const box = el('div', 'interactive-box');
      box.append(el('p', 'interactive-prompt', card.spinPrompt || 'spin the compass to pick a song!!'));

      const stage = el('div', 'spin-stage');
      const wheelWrap = el('div', 'spin-wheel-wrap');
      const pointer = el('span', 'spin-pointer');
      const wheelBtn = el('button', 'spin-wheel');
      wheelBtn.type = 'button';
      wheelBtn.setAttribute('aria-label', 'Spin Stray Kids compass');
      const img = el('img');
      img.src = C.compassImage || 'photos/compass.jpg';
      img.alt = 'Stray Kids compass';
      img.style.transform = 'scale(1.28) rotate(0deg)';
      wheelBtn.append(img);
      wheelWrap.append(pointer, wheelBtn);

      const picked = el('div', 'spin-picked', 'tap spin to roll a track!');
      const spinBtn = el('button', 'btn btn-primary', 'Spin compass!');
      spinBtn.type = 'button';

      const songs = C.playlist || [];
      const chips = el('div', 'skz-chips');
      const selectTrack = idx => {
        [...chips.children].forEach((c, ci) => c.classList.toggle('active', ci === idx));
        const s = songs[idx];
        if (s) {
          picked.textContent = `playing: ${s.title}`;
          Player.playIndex(idx);
        }
      };

      songs.forEach((s, idx) => {
        const c = el('button', 'skz-chip', s.title.replace(/\s*\(.*?\)\s*/g, '').trim());
        c.type = 'button';
        c.addEventListener('click', () => { SFX.click(); selectTrack(idx); });
        chips.append(c);
      });

      let angle = 0, spinning = false;
      const doSpin = () => {
        if (spinning || !songs.length) return;
        spinning = true;
        const pick = Math.floor(Math.random() * songs.length);
        angle += 1080 + Math.floor(Math.random() * 360);
        img.style.transform = `scale(1.28) rotate(${angle}deg)`;
        [0, 140, 290, 460, 660, 900].forEach(ms => setTimeout(() => SFX.tick(), ms));
        setTimeout(() => {
          spinning = false;
          SFX.unlock();
          FX.sparks(...centerOf(wheelBtn));
          selectTrack(pick);
        }, 1250);
      };

      wheelBtn.addEventListener('click', doSpin);
      spinBtn.addEventListener('click', doSpin);

      stage.append(wheelWrap, spinBtn, picked, chips);
      box.append(stage);
      w.append(box);
      return w;
    },

    // Day 3 (27/10): Message + Pop-the-Stress Bubble Wrap
    bubbles(card) {
      const w = el('div');
      w.append(this.head(card), el('div', 'note-card', card.message || ''));

      const box = el('div', 'interactive-box');
      box.append(el('p', 'interactive-prompt', card.bubblePrompt || 'pop the bubble wrap!!'));

      const words = card.bubbleWords || [
        'jiayouu', 'breathe', 'u got this', 'no stress',
        'here 4 u', 'chill :)', 'almost bday', 'slay',
        'happy for u', 'take a break', 'smile!!', 'yay!!',
      ];
      const grid = el('div', 'bubble-grid');
      const countLbl = el('span', null, `popped: 0 / ${words.length}`);
      const resetBtn = el('button', 'skz-chip', 'Fresh sheet');
      resetBtn.type = 'button';
      const foot = el('div', 'bubble-foot');
      foot.append(countLbl, resetBtn);

      let popped = 0;
      const buildSheet = () => {
        popped = 0;
        countLbl.textContent = `popped: 0 / ${words.length}`;
        grid.replaceChildren();
        words.forEach((word, i) => {
          const b = el('button', 'bubble-cell', word);
          b.type = 'button';
          b.addEventListener('click', () => {
            if (b.classList.contains('popped')) return;
            b.classList.add('popped');
            popped++;
            SFX.pop(i);
            FX.sparks(...centerOf(b));
            countLbl.textContent = popped === words.length ? 'all stress popped!! :)' : `popped: ${popped} / ${words.length}`;
            if (popped === words.length) {
              SFX.fanfare();
              FX.burst(...centerOf(grid), { count: 70, speed: 9 });
            }
          });
          grid.append(b);
        });
      };

      resetBtn.addEventListener('click', () => { SFX.click(); buildSheet(); });
      buildSheet();
      box.append(grid, foot);
      w.append(box);
      return w;
    },

    // Day 4 (28/10): Message + Pixel Foil Scratch-Off Ticket
    scratch(card) {
      const w = el('div');
      w.append(this.head(card), el('div', 'note-card', card.message || ''));

      const box = el('div', 'interactive-box');
      box.append(el('p', 'interactive-prompt', card.scratchPrompt || 'scratch off the blue foil below!!'));

      const wrap = el('div', 'scratch-wrap');
      if (card.scratchTitle) {
        wrap.append(el('div', 'scratch-title', card.scratchTitle));
      }
      wrap.append(
        el('div', 'scratch-secret', card.scratchSecret || 'see you sooonnnnn + hope ur ankle gets betterrr and send me pics from all the countries you go to!')
      );
      const cv = el('canvas', 'scratch-canvas');
      wrap.append(cv);

      const foot = el('div', 'bubble-foot');
      const pctLbl = el('span', null, 'scratched: 0%');
      const resetBtn = el('button', 'skz-chip', 'Reset foil');
      resetBtn.type = 'button';
      foot.append(pctLbl, resetBtn);

      let done = false, down = false;
      const paintFoil = () => {
        done = false;
        cv.classList.remove('cleared');
        pctLbl.textContent = 'scratched: 0%';
        const rw = Math.max(240, wrap.clientWidth || 320);
        const rh = Math.max(120, wrap.clientHeight || 130);
        cv.width = rw;
        cv.height = rh;
        const g = cv.getContext('2d');
        g.globalCompositeOperation = 'source-over';
        const step = 12;
        for (let y = 0; y < rh; y += step) {
          for (let x = 0; x < rw; x += step) {
            g.fillStyle = ((x / step + y / step) % 2 === 0) ? '#54A6F7' : '#7ABCF9';
            g.fillRect(x, y, step, step);
          }
        }
        g.fillStyle = '#FFFFFF';
        g.font = 'bold 13px Silkscreen, monospace';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('SCRATCH HERE !!', rw / 2, rh / 2);
      };

      const rub = (clientX, clientY) => {
        if (done) return;
        const r = cv.getBoundingClientRect();
        const x = (clientX - r.left) * (cv.width / r.width);
        const y = (clientY - r.top) * (cv.height / r.height);
        const g = cv.getContext('2d');
        g.globalCompositeOperation = 'destination-out';
        const snapX = Math.floor(x / 10) * 10 - 14;
        const snapY = Math.floor(y / 10) * 10 - 14;
        g.fillRect(snapX, snapY, 28, 28);
        SFX.scratch();

        const data = g.getImageData(0, 0, cv.width, cv.height).data;
        let clear = 0, total = 0;
        for (let i = 3; i < data.length; i += 64) {
          total++;
          if (data[i] < 64) clear++;
        }
        const pct = Math.min(100, Math.round(clear / Math.max(1, total) * 100));
        pctLbl.textContent = `scratched: ${pct}%`;
        if (pct >= 48) {
          done = true;
          cv.classList.add('cleared');
          pctLbl.textContent = 'revealed!! :)';
          SFX.unlock();
          FX.burst(...centerOf(wrap), { count: 70, speed: 9 });
        }
      };

      cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); rub(e.clientX, e.clientY); });
      cv.addEventListener('pointermove', e => { if (down) rub(e.clientX, e.clientY); });
      cv.addEventListener('pointerup', () => { down = false; });
      cv.addEventListener('pointercancel', () => { down = false; });
      resetBtn.addEventListener('click', () => { SFX.click(); paintFoil(); });

      requestAnimationFrame(() => requestAnimationFrame(paintFoil));
      box.append(wrap, foot);
      w.append(box);
      return w;
    },

    // Day 5 (29/10): Photo Album + Photobooth Pixel Sticker Decorator
    album(card) {
      const w = el('div');
      w.append(this.head(card));

      let activeSticker = null;
      const bar = el('div', 'deco-bar');
      const zoomBtn = el('button', 'deco-chip active', 'Zoom photos');
      zoomBtn.type = 'button';

      const stickerBtns = [];
      const setTool = key => {
        activeSticker = key;
        zoomBtn.classList.toggle('active', !key);
        stickerBtns.forEach(b => b.node.classList.toggle('active', b.key === key));
        board.classList.toggle('stamp-mode', Boolean(key));
      };

      zoomBtn.addEventListener('click', () => { SFX.click(); setTool(null); });
      bar.append(zoomBtn);

      [
        ['heart', 'Heart'],
        ['star', 'Star'],
        ['sparkle', 'Sparkle'],
        ['yoyo', 'Yoyo'],
      ].forEach(([key, label]) => {
        const b = el('button', 'deco-chip');
        b.type = 'button';
        b.innerHTML = STICKERS[key] + `<span>${label}</span>`;
        b.addEventListener('click', () => { SFX.click(); setTool(key); });
        stickerBtns.push({ key, node: b });
        bar.append(b);
      });

      const clearBtn = el('button', 'deco-chip', 'Clear');
      clearBtn.type = 'button';

      const board = el('div', 'album-board');
      const grid = makePolaroidGrid(card.photos || C.scrapbook || [], 'album-grid', () => !activeSticker);
      board.append(grid);

      board.addEventListener('click', e => {
        if (!activeSticker) return;
        const r = board.getBoundingClientRect();
        const s = el('span', 'album-sticker');
        s.innerHTML = STICKERS[activeSticker];
        s.style.left = (e.clientX - r.left) + 'px';
        s.style.top = (e.clientY - r.top) + 'px';
        board.append(s);
        SFX.pop(stickerBtns.findIndex(x => x.key === activeSticker));
      });

      clearBtn.addEventListener('click', () => {
        SFX.click();
        board.querySelectorAll('.album-sticker').forEach(n => n.remove());
      });
      bar.append(clearBtn);

      w.append(bar, board);
      if (card.note) w.append(el('p', 'card-note', card.note));
      return w;
    },

    // Day 6 (30/10): Birthday Message + Interactive Firework Sky Pad
    fireworks(card) {
      const w = el('div');
      w.append(this.head(card), el('div', 'note-card', card.message || ''));

      const box = el('div', 'interactive-box');
      box.append(el('p', 'interactive-prompt', card.fireworkPrompt || 'tap inside the night sky to launch fireworks!!'));

      const padBox = el('div', 'sky-pad');
      const lbl = el('span', 'sky-pad-label', 'tap anywhere to launch!!');
      padBox.append(lbl);

      let count = 0;
      const fireAt = (x, y) => {
        count++;
        lbl.textContent = `fireworks launched: ${count} !!`;
        SFX.firework();
        FX.burst(x, y, { count: 75, speed: 10 });
      };

      padBox.addEventListener('click', e => {
        fireAt(e.clientX, e.clientY);
      });

      const actions = el('div', 'card-actions');
      actions.style.justifyContent = 'center';
      const bigBtn = el('button', 'btn btn-primary', 'Launch mega burst!!');
      bigBtn.type = 'button';
      bigBtn.addEventListener('click', () => {
        SFX.fanfare();
        FX.cannons();
      });
      actions.append(bigBtn);

      if (Time.now() >= BIRTHDAY || Tester.mode === 'birthday') {
        const cakeBtn = el('button', 'btn btn-ghost', 'Go to cake');
        cakeBtn.type = 'button';
        cakeBtn.addEventListener('click', () => {
          Overlay.close('#modal');
          setTimeout(() => $('#cake').scrollIntoView({ behavior: 'smooth', block: 'center' }), 180);
        });
        actions.append(cakeBtn);
      }

      box.append(padBox, actions);
      w.append(box);
      return w;
    },
  };

  function openCard(card) {
    const box = $('#modalBox');
    box.classList.toggle('is-wide', card.type === 'album');
    const builder = Cards[card.type] || Cards.message;
    $('#modalBody').replaceChildren(builder.call(Cards, card));
    Overlay.open('#modal');
  }

  /* ===================================================================
   *  TESTER OVERRIDE SYSTEM (Top-Right Key Icon + Password)
   * =================================================================== */
  const Tester = {
    unlocked: false,
    mode: null,
    checkPassword(raw) {
      const expected = String(C.testPassword || '').trim();
      return String(raw || '').trim() === expected;
    },
    areAllCardsUnlocked() {
      return this.unlocked && (this.mode === 'cards' || this.mode === 'birthday');
    },
    activate() {
      this.unlocked = true;
      $('#keyBtn').classList.add('unlocked');
      $('#testerBar').hidden = false;
      document.body.classList.add('tester-open');
      SFX.unlock();
      this.setMode('cards');
    },
    updateButtons() {
      $('#tstCards').classList.toggle('active', this.mode === 'cards');
      $('#tstBday').classList.toggle('active', this.mode === 'birthday');
      $('#tstMidnight').classList.toggle('active', this.mode === 'midnight');
    },
    setMode(mode) {
      this.mode = mode;
      this.updateButtons();
      if (mode === 'cards') {
        Time.offset = Time.realOffset;
        phase = null;
        Advent.invalidate();
        tick();
        toast('All 6 daily cards unlocked!');
      } else if (mode === 'birthday') {
        Time.offset = BIRTHDAY + 2000 - Date.now();
        if (phase === 'birthday') phase = 'leadup';
        Advent.invalidate();
        tick();
        toast('Jumped to 30 Oct birthday mode!');
      } else if (mode === 'midnight') {
        state.candlesOut = false;
        if (Cake.built) Cake.relight(true);
        $('#aftermath').hidden = true;
        Time.offset = BIRTHDAY - 5200 - Date.now();
        phase = null;
        Advent.invalidate();
        tick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast('5 seconds to midnight!');
      }
    },
    resetAndLock() {
      this.unlocked = false;
      this.mode = null;
      this.updateButtons();
      $('#testerBar').hidden = true;
      $('#keyBtn').classList.remove('unlocked');
      document.body.classList.remove('tester-open');

      storage.clear();
      state.opened = [];
      state.score = 0;
      state.candlesOut = false;
      $('#score').hidden = true;
      $('#aftermath').hidden = true;
      $('#envelope').classList.remove('open');
      $('#envHint').hidden = false;
      $('#letter').hidden = true;
      if (Cake.built) Cake.relight(true);

      Time.offset = Time.realOffset;
      phase = null;
      Advent.invalidate();
      tick();
      SFX.click();
      toast('Locked and reset to live clock.');
    },
  };

  /* ===================================================================
   *  DAILY COUNTDOWN GRID (All cards stay unlocked forever on/after 30 Oct!)
   * =================================================================== */
  const Advent = {
    recs: [],
    stateOf(card, now) {
      if (!Tester.areAllCardsUnlocked() && now < BIRTHDAY && now < Date.parse(card.unlock)) return 'locked';
      return state.opened.includes(card.day) ? 'opened' : 'unlocked';
    },
    invalidate() {
      this.recs.forEach(r => { r.st = null; });
    },
    render(now) {
      const grid = $('#advent');
      grid.replaceChildren();
      this.recs = C.advent.map(card => {
        const t = el('button', 'tile'); t.type = 'button';
        const inner = el('div', 'tile-inner');
        const front = el('div', 'tile-face tile-front');
        const back = el('div', 'tile-face tile-back');
        inner.append(front, back); t.append(inner); grid.append(t);
        const rec = { card, t, front, back, st: null, timer: null };
        t.addEventListener('click', () => this.click(rec));
        this.paint(rec, now);
        return rec;
      });
    },
    paint(rec, now) {
      const st = this.stateOf(rec.card, now);
      if (st === rec.st) return false;
      const { card, t, front, back } = rec;
      rec.st = st;
      t.className = 'tile ' + st;
      const dayLabel = card.dateText || `Day ${card.day}`;
      front.replaceChildren(); back.replaceChildren(); rec.timer = null;

      if (st === 'locked') {
        front.insertAdjacentHTML('beforeend', LOCK_SVG);
        rec.timer = el('span', 'tile-timer', '');
        front.append(el('span', 'tile-day', dayLabel), rec.timer);
        t.setAttribute('aria-label', `${dayLabel}, locked`);
      } else {
        front.append(makeTileIcon(card), el('span', 'tile-day', dayLabel), el('span', 'tile-cta', 'tap to open'));
        back.append(makeTileIcon(card), el('span', 'tile-title', card.title), el('span', 'tile-cta', 'opened · tap again'));
        t.setAttribute('aria-label', `${dayLabel}: tap to read`);
      }
      return true;
    },
    update(now) {
      for (const rec of this.recs) {
        const prev = rec.st;
        if (this.paint(rec, now) && prev === 'locked' && !Tester.unlocked) {
          toast(`${rec.card.dateText || 'New card'} is unlocked!`);
          SFX.unlock();
        }
        if (rec.timer) rec.timer.textContent = 'in ' + fmtDur(Date.parse(rec.card.unlock) - now);
      }
    },
    click(rec) {
      const now = Time.now();
      if (rec.st === 'locked') {
        rec.t.classList.remove('shake'); void rec.t.offsetWidth; rec.t.classList.add('shake');
        SFX.deny();
        toast(`Wait till ${rec.card.dateText}!! (${fmtDur(Date.parse(rec.card.unlock) - now)} left)`);
        return;
      }
      if (rec.st === 'unlocked') {
        if (!state.opened.includes(rec.card.day)) state.opened.push(rec.card.day);
        save(); SFX.unlock();
        FX.burst(...centerOf(rec.t), { count: 45, speed: 7 });
        this.paint(rec, now);
        setTimeout(() => openCard(rec.card), 560);
        return;
      }
      SFX.click();
      openCard(rec.card);
    },
  };

  /* ===================================================================
   *  BIRTHDAY CAKE + MICROPHONE BLOW-OUT
   * =================================================================== */
  const Cake = {
    candles: [], built: false,
    build() {
      if (this.built) return;
      this.built = true;
      const box = $('#candles');
      const n = clamp(C.candles | 0 || 7, 1, 12);
      for (let i = 0; i < n; i++) {
        const c = el('button', 'candle');
        c.type = 'button';
        c.setAttribute('aria-label', `Candle ${i + 1}`);
        c.append(el('span', 'flame'), el('span', 'smoke'), el('span', 'smoke'));
        c.addEventListener('click', () => this.blow(i));
        box.append(c); this.candles.push(c);
      }
      $('#micBtn').addEventListener('click', () => Mic.start());
      $('#tapBtn').addEventListener('click', () => this.blowAll());
      $('#relightBtn').addEventListener('click', () => this.relight(false));
      if (state.candlesOut) { this.candles.forEach(c => c.classList.add('out')); this.setDone(); }
      else $('#cakeHint').textContent = C.cake?.hint || 'Make a wish!';
    },
    lit() { return this.candles.filter(c => !c.classList.contains('out')); },
    blow(i) {
      const c = this.candles[i];
      if (!c || c.classList.contains('out')) return;
      c.classList.add('out'); SFX.puff();
      if (!this.lit().length) this.allOut();
    },
    blowRandom() {
      const lit = this.lit();
      if (lit.length) this.blow(this.candles.indexOf(lit[Math.random() * lit.length | 0]));
    },
    blowAll() { this.lit().forEach((c, k) => setTimeout(() => this.blow(this.candles.indexOf(c)), k * 120)); },
    setDone() {
      $('#cakeHint').textContent = C.cake?.done || 'Wish made!';
      $('#micBtn').hidden = $('#tapBtn').hidden = true;
      $('#relightBtn').hidden = false;
      $('.cake-stage').classList.add('dark');
    },
    allOut() {
      Mic.stop();
      this.setDone();
      setTimeout(() => { SFX.fanfare(); FX.cannons(); }, 350);
      const first = !state.candlesOut;
      state.candlesOut = true; save();
      showAftermath(first);
    },
    relight(silent) {
      Mic.stop();
      this.candles.forEach(c => c.classList.remove('out'));
      $('#cakeHint').textContent = C.cake?.hint || 'Make a wish!';
      $('#micBtn').hidden = $('#tapBtn').hidden = false;
      $('#relightBtn').hidden = true;
      $('.cake-stage').classList.remove('dark');
      if (!silent) SFX.click();
    },
  };

  const Mic = {
    stream: null, src: null, raf: 0,
    async start() {
      if (this.stream) return;
      const btn = $('#micBtn');
      if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
        toast('Mic works once hosted online (https). Tap the candles for now!');
        return;
      }
      btn.disabled = true; btn.textContent = 'Allow mic...';
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      } catch {
        btn.disabled = false; btn.textContent = 'Blow into mic';
        toast('No mic access, just tap the candles!');
        return;
      }
      btn.textContent = 'Listening...';
      const ctx = AudioEngine.ensure();
      this.src = ctx.createMediaStreamSource(this.stream);
      const an = ctx.createAnalyser(); an.fftSize = 1024;
      this.src.connect(an);
      $('#micMeter').hidden = false;
      $('#cakeHint').textContent = 'stay quiet for 1 sec...';
      const buf = new Float32Array(an.fftSize), cake = $('#cake');
      let samples = [], thr = 0.1, blowing = 0;
      const t0 = performance.now();
      const loop = () => {
        an.getFloatTimeDomainData(buf);
        let sum = 0; for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        $('#micFill').style.width = Math.min(100, rms / (thr * 1.4) * 100) + '%';
        if (performance.now() - t0 < 700) samples.push(rms);
        else {
          if (samples) {
            const amb = samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length);
            thr = Math.max(0.06, amb * 3.5); samples = null;
            $('#cakeHint').textContent = 'now blow into your mic!!';
          }
          if (rms > thr) { blowing++; cake.classList.add('wobble'); if (blowing % 5 === 0) Cake.blowRandom(); }
          else { blowing = Math.max(0, blowing - 1); if (rms < thr * 0.6) cake.classList.remove('wobble'); }
        }
        this.raf = requestAnimationFrame(loop);
      };
      loop();
    },
    stop() {
      cancelAnimationFrame(this.raf);
      if (this.stream) this.stream.getTracks().forEach(t => t.stop());
      if (this.src) try { this.src.disconnect(); } catch { /* ignore */ }
      this.stream = this.src = null;
      $('#micMeter').hidden = true;
      $('#cake').classList.remove('wobble');
      const btn = $('#micBtn'); btn.disabled = false; btn.textContent = 'Blow into mic';
    },
  };

  /* ===================================================================
   *  ENVELOPE NOTE + PHOTO ALBUM (30 Oct)
   * =================================================================== */
  let aftermathBuilt = false;
  function showAftermath(scroll) {
    $('#aftermath').hidden = false;
    if (!aftermathBuilt) {
      aftermathBuilt = true;
      const env = $('#envelope');
      env.addEventListener('click', () => {
        if (env.classList.contains('open')) return;
        env.classList.add('open'); SFX.unlock();
        $('#envHint').hidden = true;
        setTimeout(() => {
          const L = C.letter || {}, paper = $('#letter');
          paper.replaceChildren(
            el('span', 'px-corner tl'),
            el('span', 'px-corner tr'),
            el('span', 'px-corner bl'),
            el('span', 'px-corner br')
          );
          if (L.greeting) paper.append(el('p', null, L.greeting));
          String(L.body || '').split(/\n\s*\n/).forEach(par => paper.append(el('p', 'letter-main', par)));
          if (L.signoff) paper.append(el('p', 'letter-sign', L.signoff));
          paper.hidden = false;
          paper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
      });

      const scrap = $('#scrapbook');
      const grid = makePolaroidGrid(C.scrapbook || [], 'scrapbook');
      scrap.replaceWith(grid);
      grid.id = 'scrapbook';
    }
    if (scroll) setTimeout(() => $('#aftermath').scrollIntoView({ behavior: 'smooth', block: 'start' }), 1400);
  }

  /* ===================================================================
   *  SECRET CONSOLE (>_ button or ` key)
   * =================================================================== */
  const ASCII_CAKE = [
    '        i  i  i  i  i',
    '       |~~~~~~~~~~~~~~~|',
    `       |  H A P P Y ${pad(AGE)} |`,
    '    ___|_______________|___',
    '   |~~~~~~~~~~~~~~~~~~~~~~~|',
    '   |   B I R T H D A Y !!  |',
    '   |_______________________|',
  ].join('\n');
  const ASCII_FENCE = [
    '      o_/                \\_o',
    '     /|  \\______  ______/  |\\',
    '     / \\         X         / \\',
    '    /   \\                 /   \\',
  ].join('\n');
  const T = C.terminal || {};
  const Term = {
    hist: [], hi: 0, booted: false,
    open() {
      Overlay.open('#terminal');
      if (!this.booted) {
        this.booted = true;
        this.print(`hi xin ying!! secret console unlocked :)\ntype "help" to see what u can type!\n`, 'ok');
      }
      setTimeout(() => $('#termIn').focus(), 60);
    },
    print(text, cls) { const out = $('#termOut'); out.append(el('div', cls, text)); out.scrollTop = out.scrollHeight; },
    run(raw) {
      const cmd = raw.trim();
      this.print('> ' + cmd, 'cmd');
      if (!cmd) return;
      this.hist.push(cmd); this.hi = this.hist.length;
      const [name, ...args] = cmd.split(/\s+/);
      const fn = this.cmds[name.toLowerCase()];
      if (!fn) { this.print(`hmm unknown command: ${name} (try "help")`, 'err'); return; }
      const r = fn.call(this, args);
      if (r) Array.isArray(r) ? this.print(r[0], r[1]) : this.print(r);
    },
    cmds: {
      help: () => [
        'commands you can try:',
        '  whoami      about xin ying',
        '  countdown   time left till 30 oct',
        '  skz         fav stray kids songs',
        '  fencing     en garde!!',
        '  yoyo        tiny yoyo check',
        '  photos      open photo album',
        '  wish        secret birthday note',
        '  cake        jump to birthday cake',
        '  music       play / pause music',
        '  sudo        root check',
        '  clear       clear console',
        '  exit        close console',
      ].join('\n'),
      whoami: () => T.whoami || C.name,
      countdown: () => {
        const d = BIRTHDAY - Time.now();
        return d > 0 ? `${fmtDur(d)} left till xin ying's birthday!!` : ['IT IS YOUR BIRTHDAY!! HAPPY 17TH!!', 'ok'];
      },
      skz: () => T.skz || 'Stray Kids!!',
      fencing: () => ASCII_FENCE + '\n\n' + ((T.fencingFacts || [])[Math.random() * (T.fencingFacts || []).length | 0] || 'jiayouu hg!!'),
      yoyo: () => { SFX.yoyo(); return [T.yoyo || '   (o)\n    |\n   (@)  yoyo!!', 'ok']; },
      photos: () => {
        const albumCard = C.advent.find(a => a.type === 'album');
        const unlock = albumCard ? Date.parse(albumCard.unlock) : BIRTHDAY;
        if (!Tester.areAllCardsUnlocked() && Time.now() < BIRTHDAY && Time.now() < unlock) {
          return [`wait till 29/10!! (${fmtDur(unlock - Time.now())} left)`, 'err'];
        }
        setTimeout(() => { Overlay.close('#terminal'); if (albumCard) openCard(albumCard); }, 250);
        return ['opening photo album...', 'ok'];
      },
      memory: function () { return this.cmds.photos(); },
      wish: () => (Tester.areAllCardsUnlocked() || Time.now() >= BIRTHDAY)
        ? [T.wish || '', 'ok']
        : [`locked till 30/10!! (${fmtDur(BIRTHDAY - Time.now())} left)`, 'err'],
      cake: function () {
        if (Time.now() < BIRTHDAY && Tester.mode !== 'birthday') return ['wait till 30 oct for the cake!!', 'err'];
        setTimeout(() => { Overlay.close('#terminal'); $('#cake').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 400);
        return [ASCII_CAKE, 'ok'];
      },
      music: () => { Player.toggle(); return Player.playing ? `now playing: ${Player.cur().title}` : 'music paused'; },
      play: () => { if (!Player.playing) Player.play(); return `now playing: ${Player.cur().title}`; },
      unlock: function (args) {
        if (args.length && Tester.checkPassword(args.join(' '))) {
          Tester.activate();
          setTimeout(() => Overlay.close('#terminal'), 400);
          return ['preview unlocked!! check the top bar.', 'ok'];
        }
        return ['nice try HAHA password needed!', 'err'];
      },
      sudo: () => 'it is your birthday week, you are the boss here :)',
      hbd: () => [ASCII_CAKE, 'ok'],
      ls: () => '25_oct_fencing   26_oct_skz   27_oct_bubbles   28_oct_scratch   29_oct_photos   30_oct_bday   yoyo',
      clear: () => { $('#termOut').replaceChildren(); },
      exit: () => { Overlay.close('#terminal'); },
    },
  };
  $('#termBtn').addEventListener('click', () => Term.open());
  $('#termForm').addEventListener('submit', e => { e.preventDefault(); const i = $('#termIn'); Term.run(i.value); i.value = ''; });
  $('#termIn').addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && Term.hi > 0) { Term.hi--; e.target.value = Term.hist[Term.hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { Term.hi = Math.min(Term.hist.length, Term.hi + 1); e.target.value = Term.hist[Term.hi] || ''; e.preventDefault(); }
    else if (e.key.length === 1) SFX.key();
  });

  /* ===================================================================
   *  DOUBLE-TAP CLOCK FENCING + YO-YO CHARM + PASSWORD MODAL
   * =================================================================== */
  let lastTap = 0;
  $('#digits').addEventListener('pointerup', e => {
    const now = performance.now();
    if (now - lastTap < 330) { lastTap = 0; scorePoint(e.clientX, e.clientY); } else lastTap = now;
  });

  function scorePoint(x, y) {
    SFX.clash(); FX.sparks(x, y);
    const pop = el('div', 'clash-pop');
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
    pop.innerHTML = FOIL_SVG + FOIL_SVG;
    document.body.append(pop); setTimeout(() => pop.remove(), 520);
    state.score++; save();
    showScore(true);
    $('#lampR').classList.add('flash'); setTimeout(() => $('#lampR').classList.remove('flash'), 350);
    const cheers = C.fencingCheers || ['jiayouu hg', 'im alw here for uuu'];
    toast(cheers[(state.score - 1) % cheers.length]);
  }

  function showScore(bump) {
    if (!state.score) return;
    const s = $('#score'); s.hidden = false; $('#scoreVal').textContent = state.score;
    if (bump) { s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
  }

  let yoyoSeen = false;
  $('#yoyoBtn').addEventListener('click', () => {
    const btn = $('#yoyoBtn');
    btn.classList.remove('drop');
    void btn.offsetWidth;
    btn.classList.add('drop');
    SFX.yoyo();
    if (!yoyoSeen) {
      yoyoSeen = true;
      toast('yoyo :)');
    }
  });

  $('#keyBtn').addEventListener('click', () => {
    SFX.click();
    if (Tester.unlocked) {
      $('#testerBar').hidden = !$('#testerBar').hidden;
      document.body.classList.toggle('tester-open', !$('#testerBar').hidden);
      return;
    }
    $('#passInput').value = '';
    $('#passErr').hidden = true;
    Overlay.open('#passModal');
    setTimeout(() => $('#passInput').focus(), 60);
  });

  $('#passForm').addEventListener('submit', e => {
    e.preventDefault();
    if (Tester.checkPassword($('#passInput').value)) {
      Overlay.close('#passModal');
      Tester.activate();
    } else {
      $('#passErr').hidden = false;
      SFX.deny();
      const box = $('#passModal .modal');
      box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    }
  });

  $('#tstCards').addEventListener('click', () => { SFX.click(); Tester.setMode('cards'); });
  $('#tstBday').addEventListener('click', () => { SFX.click(); Tester.setMode('birthday'); });
  $('#tstMidnight').addEventListener('click', () => { SFX.click(); Tester.setMode('midnight'); });
  $('#tstExit').addEventListener('click', () => Tester.resetAndLock());

  /* ===================================================================
   *  MAIN COUNTDOWN CLOCK (Targets 30 October 00:00!)
   * =================================================================== */
  const D = { d: $('#dd'), h: $('#hh'), m: $('#mm'), s: $('#ss') };
  const COUNT_START = Math.min(...C.advent.map(a => Date.parse(a.unlock)));
  let phase = null, gateDone = false;

  function setNum(node, v) {
    if (node.textContent === v) return;
    node.textContent = v;
    node.classList.remove('tick'); void node.offsetWidth; node.classList.add('tick');
  }

  function enterLeadup() {
    document.body.classList.remove('is-birthday');
    $('#celebration').hidden = true;
    $('#lampL').classList.add('on'); $('#lampR').classList.remove('on');
    $('#hudTitle').textContent = C.countdownTitle || "Days to xin ying's birthday";
  }

  function enterBirthday(live) {
    document.body.classList.add('is-birthday');
    $('#celebration').hidden = false;
    $('#lampL').classList.remove('on'); $('#lampR').classList.add('on');
    $('#hudTitle').textContent = C.birthdayTitle || 'Happy birthday xin ying!!';
    Object.values(D).forEach(n => setNum(n, '00'));
    $('#progress').style.width = '100%';
    Cake.build();
    if (state.candlesOut) showAftermath(false);
    if (live && gateDone) celebrate();
  }

  function celebrate() {
    SFX.fanfare();
    FX.cannons();
    if (C.autoplayMusic && state.sfx && !Player.playing) {
      Player.playIndex(Player.firstPlayable());
    }
    setTimeout(() => $('#celebration').scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }

  function tick() {
    const now = Time.now(), diff = BIRTHDAY - now;
    const next = diff <= 0 ? 'birthday' : 'leadup';
    if (next !== phase) {
      const prev = phase; phase = next;
      if (phase === 'birthday') enterBirthday(prev === 'leadup'); else enterLeadup();
    }
    if (phase === 'leadup') {
      const s = Math.floor(diff / 1000);
      setNum(D.d, pad(s / 86400));
      setNum(D.h, pad(s % 86400 / 3600));
      setNum(D.m, pad(s % 3600 / 60));
      setNum(D.s, pad(s % 60));
      const pct = clamp((now - COUNT_START) / (BIRTHDAY - COUNT_START), 0, 1) * 100;
      $('#progress').style.width = pct.toFixed(2) + '%';
    }
    Advent.update(now);
  }

  function closeGate(withSound) {
    state.sfx = withSound; save();
    $('#pSfx').checked = withSound;
    if (withSound) AudioEngine.ensure();
    $('#gate').hidden = true;
    gateDone = true;
    if (phase === 'birthday') celebrate();
    else if (withSound && C.autoplayMusic) Player.play();
  }

  async function boot() {
    document.querySelectorAll('[data-name]').forEach(n => { n.textContent = C.name; });
    $('#ageBadge').textContent = String(AGE);
    $('#fromName').textContent = C.signoffLine || 'from ur hb, josiah';
    if (C.compassImage) {
      document.querySelectorAll('.compass-img, .disc-compass, .p-panel-compass').forEach(img => {
        img.src = C.compassImage;
      });
    }
    FX.init();
    Player.init();
    showScore(false);

    $('#gateSound').addEventListener('click', () => closeGate(true));
    $('#gateMute').addEventListener('click', () => closeGate(false));

    Advent.render(Time.now());
    tick();
    setInterval(tick, 250);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

    await Promise.all([Time.sync(), Player.probe()]);
    Advent.invalidate();
    tick();
  }

  boot();
})();
