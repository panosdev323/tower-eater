export class PauseMenu {
  constructor(onResume, onRestart, onMusicToggle) {
    this.onResume      = onResume;
    this.onRestart     = onRestart;
    this.onMusicToggle = onMusicToggle;
    this.musicOn       = true;
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
      <div class="pm-music-row">
        <span class="pm-label">🎵 Background Music</span>
        <label class="pm-switch">
          <input type="checkbox" id="pm-music-toggle" checked />
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
    document.getElementById('pm-restart').onclick = () => {
      if (confirm('Are you sure? All progress will be lost.')) {
        this.hide();
        this.onRestart();
      }
    };
    document.getElementById('pm-music-toggle').onchange = (e) => {
      this.musicOn = e.target.checked;
      this.onMusicToggle(this.musicOn);
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