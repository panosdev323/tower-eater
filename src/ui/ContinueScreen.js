import { AdManager } from '../systems/AdManager.js';
import { soundManager } from '../systems/SoundManager.js';

const RETRY_KEY = 'te_retry_cooldown';
const RETRY_MS  = 5 * 60 * 1000; // 5 λεπτά

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

    // Ξεκινά αμέσως το retry cooldown
    this._setRetryCooldown();

    this._render();
  }

  _render() {
    const onCooldown     = AdManager.isOnCooldown();
    const adRemaining    = AdManager.cooldownRemaining();
    const retryRemaining = this._retryRemaining();
    const canRetry       = retryRemaining <= 0;

    this.modal.innerHTML = `
      <div style="font-size:48px">💀</div>
      <div style="font-size:22px;font-weight:bold;color:#ff4444;letter-spacing:2px">
        YOU DIED
      </div>

      ${onCooldown ? `
        <div style="font-size:14px;color:#888;line-height:1.6">
          Next ad available in:
        </div>
        <div id="continue-ad-countdown" style="
          font-size:32px;font-weight:bold;color:#ffaa00;
          font-variant-numeric:tabular-nums;
        ">${this._formatTime(adRemaining)}</div>
      ` : `
        <div style="font-size:15px;color:#aaa;line-height:1.6">
          Watch a short ad to continue<br>from exactly where you left off.
        </div>
        <button id="continue-watch-ad" style="
          padding:16px; border:none; border-radius:14px;
          font-size:17px; font-weight:bold; cursor:pointer;
          background:linear-gradient(135deg,#4a2aff,#8844ff);
          color:#fff; letter-spacing:0.5px;
        ">▶ Watch Ad to Continue</button>
        <div style="font-size:13px;color:#aaa;font-style:italic;font-weight:bold;margin-top:-8px">
          ▸ Play immediately after the ad
        </div>
      `}

      <div style="height:1px;background:rgba(255,255,255,0.08)"></div>

      <button id="continue-give-up" style="
        padding:12px; border:1px solid rgba(255,255,255,0.1);
        border-radius:12px; font-size:15px; cursor:pointer;
        background:rgba(255,255,255,0.05); color:#666;
        ${!canRetry ? 'opacity:0.4; cursor:not-allowed;' : ''}
      " ${!canRetry ? 'disabled' : ''}>↺ Retry Level</button>

      ${!canRetry ? `
        <div style="font-size:12px;color:#555;margin-top:-8px">
          Available in <span id="continue-retry-countdown"
            style="color:#ff4444;font-weight:bold;">
            ${this._formatTime(retryRemaining)}
          </span>
        </div>
      ` : ''}
    `;

    document.getElementById('continue-watch-ad')?.addEventListener('click', async () => {
      await this._handleWatchAd();
    });

    document.getElementById('continue-give-up')?.addEventListener('click', () => {
      if (!canRetry) return;
      this._close();
      this.onGiveUp();
    });

    this._startCountdowns();
  }

  async _handleWatchAd() {
    const btn = document.getElementById('continue-watch-ad');
    if (!btn) return;

    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.textContent = 'Loading Ad...';

    const result = await AdManager.showContinueAd(soundManager);

    if (result === 'rewarded' || result === 'web') {
      localStorage.removeItem(RETRY_KEY); // καθαρίζει το retry cooldown
      this._close();
      this.onContinue();

    } else if (result === 'no_fill' || result === 'no_reward') {
      localStorage.removeItem(RETRY_KEY);
      btn.textContent = '⚠️ No Ad Available';
      btn.style.opacity = '0.4';
      this._render();

    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.textContent = '▶ Watch Ad to Continue';
      const err = document.createElement('div');
      err.textContent = '⚠️ Something went wrong, try again';
      err.style.cssText = 'color:#ff6666;font-size:13px;';
      this.modal.appendChild(err);
    }
  }

  _startCountdowns() {
    if (this._timer) clearInterval(this._timer);

    this._timer = setInterval(() => {
      // Ad countdown
      const adEl = document.getElementById('continue-ad-countdown');
      if (adEl) {
        const r = AdManager.cooldownRemaining();
        if (r <= 0) { AdManager.clearCooldown(); clearInterval(this._timer); this._render(); return; }
        adEl.textContent = this._formatTime(r);
      }

      // Retry countdown
      const retryEl = document.getElementById('continue-retry-countdown');
      if (retryEl) {
        const r = this._retryRemaining();
        if (r <= 0) { clearInterval(this._timer); this._render(); return; }
        retryEl.textContent = this._formatTime(r);
      }
    }, 1000);
  }

  _setRetryCooldown() {
    // Βάλε cooldown κάθε φορά
    localStorage.setItem(RETRY_KEY, String(Date.now() + RETRY_MS));
  }

  _retryRemaining() {
    const ts = localStorage.getItem(RETRY_KEY);
    if (!ts) return 0;
    return Math.max(0, Math.ceil((parseInt(ts, 10) - Date.now()) / 1000));
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