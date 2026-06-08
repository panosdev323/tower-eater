import { soundManager } from '../systems/SoundManager.js';
import { ProgressManager } from '../systems/ProgressManager.js';

export class PauseMenu {
  constructor(onResume, onRestart, onMusicToggle, onSoundsToggle) {
    this.onResume       = onResume;
    this.onRestart      = onRestart;
    this.onMusicToggle  = onMusicToggle;
    this.onSoundsToggle = onSoundsToggle;
    this._build();
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'pause-overlay';

    this.modal = document.createElement('div');
    this.modal.id = 'pause-modal';
    this.modal.innerHTML = `
      <div class="pm-title">⏸ PAUSED</div>

      <button class="pm-btn pm-primary" id="pm-resume">▶ Resume</button>

      <div class="pm-toggle-row">
        <span class="pm-label">🔊 Sound Effects</span>
        <label class="pm-switch">
          <input type="checkbox" id="pm-sounds-toggle" ${soundManager.soundsOn ? 'checked' : ''} />
          <span class="pm-slider"></span>
        </label>
      </div>

      <div class="pm-toggle-row">
        <span class="pm-label">🎵 Background Music</span>
        <label class="pm-switch">
          <input type="checkbox" id="pm-music-toggle" ${soundManager.musicOn ? 'checked' : ''} />
          <span class="pm-slider"></span>
        </label>
      </div>

      <div class="pm-divider"></div>

      <button class="pm-btn pm-danger" id="pm-restart">↺ Start Over</button>
      <p class="pm-warning">⚠️ Resets ALL progress — back to Level 1.</p>

      <div class="pm-divider"></div>
      <a class="pm-privacy" href="#" id="pm-privacy">🔒 Privacy Policy</a>
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);

    document.getElementById('pm-resume').onclick = () => this.hide();

    document.getElementById('pm-sounds-toggle').onchange = (e) => {
      soundManager.setSounds(e.target.checked);
      if (this.onSoundsToggle) this.onSoundsToggle(e.target.checked);
    };

    document.getElementById('pm-music-toggle').onchange = (e) => {
      soundManager.setMusic(e.target.checked);
      if (this.onMusicToggle) this.onMusicToggle(e.target.checked);
    };

    document.getElementById('pm-restart').onclick = () => {
      if (confirm('Are you sure? All progress will be lost.')) {
        ProgressManager.reset();
        this.hide();
        this.onRestart();
      }
    };

    document.getElementById('pm-privacy').onclick = (e) => {
      e.preventDefault();
      window.open('https://yoursite.com/privacy', '_blank');
    };

    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) this.hide();
    };

    this.overlay.style.display = 'none';
  }

  show() {
    this.overlay.style.display = 'flex';
    window.dispatchEvent(new CustomEvent('pauseGame'));
  }

  hide() {
    this.overlay.style.display = 'none';
    window.dispatchEvent(new CustomEvent('resumeGame'));
    this.onResume();
  }

  destroy() {
    this.overlay.remove();
  }
}