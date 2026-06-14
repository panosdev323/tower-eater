import { AdManager } from '../systems/AdManager.js';
import { SpriteFactory } from '../systems/SpriteFactory.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { IntroScreen } from '../ui/IntroScreen.js';
import { soundManager } from '../systems/SoundManager.js';

const RETRY_KEY = 'te_retry_cooldown';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // ── Loading bar ──────────────────────────────────────────────
    const barBg  = this.add.rectangle(240, 427, 304, 10, 0x222222);
    const barFill = this.add.rectangle(88, 427, 0, 8, 0x00ff88).setOrigin(0, 0.5);

    this.load.on('progress', (v) => {
      barFill.width = 300 * v;
    });

    // ── Load all assets here, where Phaser expects them ──────────
    SpriteFactory.preloadAll(this);
  }

  async create() {
    await AdManager.initialize();
    if (this.scene.isActive('GameScene')) {
        this.scene.stop('GameScene');
    }
    // Small delay so the loading bar flash isn't jarring
    this.time.delayedCall(200, () => {
      const isFirstTime = !localStorage.getItem('te_seen_intro');

      if (isFirstTime) {
        localStorage.setItem('te_seen_intro', 'true');
        new IntroScreen((levelIndex) => {
          this.scene.start('GameScene', { levelIndex });
        });
        return;
      }

      const savedLevel = ProgressManager.getSavedLevel();

      // ✅ Έλεγχος retry cooldown — persist across restart
      const retryRemaining = this._retryRemaining();
      if (retryRemaining > 0) {
        this._showRetryLock(savedLevel, retryRemaining);
      } else {
        this.scene.start('GameScene', { levelIndex: savedLevel });
      }
    });
  }

  // ── Retry cooldown helpers ──────────────────────────────────────

  _retryRemaining() {
    const ts = localStorage.getItem(RETRY_KEY);
    if (!ts) return 0;
    return Math.max(0, Math.ceil((parseInt(ts, 10) - Date.now()) / 1000));
  }

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  // ── Lock screen (shown if cooldown still active on app start) ──

  _showRetryLock(savedLevel, remaining) {
    const overlay = document.createElement('div');
    overlay.id = 'retry-lock-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.92);
      z-index:500; display:flex; align-items:center; justify-content:center;
      font-family:system-ui,sans-serif;
    `;

    overlay.innerHTML = `
      <div style="
        background:#0f0f1f; border:1px solid rgba(255,255,255,0.1);
        border-radius:20px; padding:32px 28px; width:min(340px,90vw);
        display:flex; flex-direction:column; gap:16px; text-align:center;
        box-shadow:0 0 60px rgba(255,50,50,0.2);
      ">
        <div style="font-size:48px">⏳</div>
        <div style="font-size:18px;color:#aaa;line-height:1.6">
          Watch a short ad to play now
        </div>
        <button id="lock-watch-ad" style="
          padding:16px; border:none; border-radius:14px;
          font-size:17px; font-weight:bold; cursor:pointer;
          background:linear-gradient(135deg,#4a2aff,#8844ff);
          color:#fff;
        ">▶ Watch Ad to Play</button>

        <div style="height:1px;background:rgba(255,255,255,0.08)"></div>

        <div style="font-size:13px;color:#666">
          Or wait:
        </div>
        <div id="lock-countdown" style="
          font-size:32px;font-weight:bold;color:#ffaa00;
          font-variant-numeric:tabular-nums;
        ">${this._formatTime(remaining)}</div>
      </div>
    `;

    document.body.appendChild(overlay);

    const proceed = () => {
      clearInterval(timer);
      overlay.remove();
      this.scene.start('GameScene', { levelIndex: savedLevel });
    };

    document.getElementById('lock-watch-ad').addEventListener('click', async (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.textContent = 'Loading Ad...';

      const result = await AdManager.showContinueAd(soundManager);

      if (result === 'rewarded' || result === 'web' || result === 'no_fill' || result === 'no_reward') {
        localStorage.removeItem(RETRY_KEY);
        proceed();
      } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.textContent = '▶ Watch Ad to Play';
      }
    });

    const timer = setInterval(() => {
      const r = this._retryRemaining();
      const el = document.getElementById('lock-countdown');
      if (r <= 0) {
        proceed();
        return;
      }
      if (el) el.textContent = this._formatTime(r);
    }, 1000);
  }
}