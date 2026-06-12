import { AdManager } from '../systems/AdManager.js';
import { soundManager } from '../systems/SoundManager.js';

export class ContinueScreen {
  constructor(onContinue, onGiveUp) {
    this.onContinue = onContinue;
    this.onGiveUp   = onGiveUp;
    this._timer     = null;
    this._build();
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'continue-overlay';
    this.overlay.style.cssText = `
      position:fixed; inset:0;
      background:rgba(0,0,0,0.85);
      z-index:300;
      display:flex; align-items:center; justify-content:center;
      backdrop-filter:blur(8px);
      font-family:system-ui,sans-serif;
    `;

    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      background:#0f0f1f;
      border:1px solid rgba(255,255,255,0.1);
      border-radius:20px;
      padding:32px 28px;
      width:min(340px,90vw);
      display:flex; flex-direction:column;
      gap:16px; text-align:center;
      box-shadow:0 0 60px rgba(255,50,50,0.2);
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);
    this._render();
  }

  _render() {
    const onCooldown  = AdManager.isOnCooldown();
    const remaining   = AdManager.cooldownRemaining();

    this.modal.innerHTML = `
      <div style="font-size:48px">💀</div>
      <div style="font-size:22px;font-weight:bold;color:#ff4444;letter-spacing:2px">
        YOU DIED
      </div>

      ${onCooldown ? `
        <div style="font-size:14px;color:#888;line-height:1.6">
          Watch an ad to continue from this level.<br>
          Next ad available in:
        </div>
        <div id="continue-countdown" style="
          font-size:32px;font-weight:bold;color:#ffaa00;
          font-variant-numeric:tabular-nums;
        ">${this._formatTime(remaining)}</div>
        <div style="font-size:12px;color:#555">
          Or give up and retry from the start of this level.
        </div>
      ` : `
        <div style="font-size:15px;color:#aaa;line-height:1.6">
          Watch a short ad to continue<br>from exactly where you left off.
        </div>
      `}

      ${onCooldown ? '' : `
        <button id="continue-watch-ad" style="
          padding:16px; border:none; border-radius:14px;
          font-size:17px; font-weight:bold; cursor:pointer;
          background:linear-gradient(135deg,#4a2aff,#8844ff);
          color:#fff; letter-spacing:0.5px;
        ">▶ Watch Ad to Continue</button>
      `}

      <button id="continue-give-up" style="
        padding:12px; border:1px solid rgba(255,255,255,0.1);
        border-radius:12px; font-size:15px; cursor:pointer;
        background:rgba(255,255,255,0.05); color:#666;
      ">${onCooldown ? '↺ Retry Level' : 'Give Up — Retry Level'}</button>
    `;

    // Watch Ad button
    document.getElementById('continue-watch-ad')?.addEventListener('click', async () => {
      await this._handleWatchAd();
    });

    // Give up
    document.getElementById('continue-give-up')?.addEventListener('click', () => {
      this._close();
      this.onGiveUp();
    });

    // Start countdown if on cooldown
    if (onCooldown) {
      this._startCountdown();
    }
  }

  async _handleWatchAd() {
    const btn = document.getElementById('continue-watch-ad');
    if (!btn) return;

    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.textContent = 'Loading Ad...';

    const result = await AdManager.showContinueAd(soundManager);

    if (result === 'rewarded') {
      this._close();
      this.onContinue();

    } else if (result === 'web') {
      // Dev/web mode — simulate reward
      this._close();
      this.onContinue();

    } else if (result === 'no_fill' || result === 'no_reward') {
      btn.textContent = '⚠️ No Ad Available';
      btn.style.opacity = '0.4';
      // Show cooldown
      this._render();

    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.textContent = '▶ Watch Ad to Continue';

      // Show error message
      const err = document.createElement('div');
      err.textContent = '⚠️ Something went wrong, try again';
      err.style.cssText = 'color:#ff6666;font-size:13px;';
      this.modal.appendChild(err);
    }
  }

  _startCountdown() {
    if (this._timer) clearInterval(this._timer);

    this._timer = setInterval(() => {
      const remaining = AdManager.cooldownRemaining();
      const el = document.getElementById('continue-countdown');

      if (!el) {
        clearInterval(this._timer);
        return;
      }

      if (remaining <= 0) {
        clearInterval(this._timer);
        AdManager.clearCooldown();
        this._render(); // re-render με το ad button
        return;
      }

      el.textContent = this._formatTime(remaining);
    }, 1000);
  }

  _formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  _close() {
    if (this._timer) clearInterval(this._timer);
    this.overlay.remove();
  }

  destroy() {
    this._close();
  }
}