import { TOTAL_LEVELS } from '../data/levels.js';
export class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data) {
    this.levelData = data.level;
    this.win       = data.win;
    this.stats     = data.stats;
  }

  create() {
    // Σκόπιμα αφαιρούμε τυχόν παλιούς GameScene listeners
    window.removeEventListener('pauseGame',  window.__lastPauseHandler__);
    window.removeEventListener('resumeGame', window.__lastResumeHandler__);

    const cx = 240;
    this.add.rectangle(cx, 427, 480, 854, 0x0a0a1a);

    // ── Settings button ──────────────────────────────────
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.onclick = null;
      settingsBtn.onclick = () => this._openSettings();
    }

    if (this.win) this.showWin(cx);
    else          this.showDeath(cx);
  }

  _openSettings() {
    if (this._settingsOpen) return;
    this._settingsOpen = true;

    // Simple DOM overlay — χωρίς pauseGame/resumeGame events
    const overlay = document.createElement('div');
    overlay.id = 'level-settings-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.75);
      z-index:200; display:flex; align-items:center;
      justify-content:center; backdrop-filter:blur(6px);
    `;

    overlay.innerHTML = `
      <div style="
        background:#0f0f1f; border:1px solid rgba(255,255,255,0.1);
        border-radius:20px; padding:32px 28px; width:min(340px,90vw);
        display:flex; flex-direction:column; gap:14px;
        box-shadow:0 0 60px rgba(100,50,255,0.3); font-family:system-ui,sans-serif;
      ">
        <div style="text-align:center;font-size:22px;font-weight:bold;color:#fff;letter-spacing:2px">
          ⚙️ SETTINGS
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0">
          <span style="font-size:15px;color:#aaa">🔊 Sound Effects</span>
          <label style="position:relative;display:inline-block;width:46px;height:26px">
            <input type="checkbox" id="ls-sounds" ${window.__soundManager__?.soundsOn ? 'checked' : ''} style="opacity:0;width:0;height:0">
            <span id="ls-sounds-slider" style="
              position:absolute;cursor:pointer;inset:0;
              background:${window.__soundManager__?.soundsOn ? '#6633ff' : '#333'};
              border-radius:26px;transition:0.3s;
            "><span style="
              position:absolute;height:20px;width:20px;
              left:${window.__soundManager__?.soundsOn ? '23px' : '3px'};bottom:3px;
              background:#fff;border-radius:50%;transition:0.3s;
            "></span></span>
          </label>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0">
          <span style="font-size:15px;color:#aaa">🎵 Background Music</span>
          <label style="position:relative;display:inline-block;width:46px;height:26px">
            <input type="checkbox" id="ls-music" ${window.__soundManager__?.musicOn ? 'checked' : ''} style="opacity:0;width:0;height:0">
            <span id="ls-music-slider" style="
              position:absolute;cursor:pointer;inset:0;
              background:${window.__soundManager__?.musicOn ? '#6633ff' : '#333'};
              border-radius:26px;transition:0.3s;
            "><span style="
              position:absolute;height:20px;width:20px;
              left:${window.__soundManager__?.musicOn ? '23px' : '3px'};bottom:3px;
              background:#fff;border-radius:50%;transition:0.3s;
            "></span></span>
          </label>
        </div>

        <div style="height:1px;background:rgba(255,255,255,0.08)"></div>

        <button id="ls-restart" style="
          width:100%;padding:14px;border:1px solid rgba(255,60,60,0.3);
          border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer;
          background:rgba(255,60,60,0.15);color:#ff6666;font-family:system-ui,sans-serif;
        ">↺ Start Over</button>
        <p style="font-size:12px;color:#666;text-align:center;margin-top:-8px">
          ⚠️ Resets ALL progress — back to Level 1.
        </p>

        <div style="height:1px;background:rgba(255,255,255,0.08)"></div>

        <button id="ls-close" style="
          width:100%;padding:14px;border:none;border-radius:12px;
          font-size:16px;font-weight:bold;cursor:pointer;
          background:linear-gradient(135deg,#4a2aff,#8844ff);
          color:#fff;font-family:system-ui,sans-serif;
        ">▶ Close</button>

        <a href="#" id="ls-privacy" style="
          display:block;text-align:center;font-size:15px;
          color:#666;text-decoration:underline;margin-top:4px;padding:6px 0;
        ">🔒 Privacy Policy</a>
      </div>
    `;

    document.body.appendChild(overlay);

    // Toggle sounds
    document.getElementById('ls-sounds').onchange = (e) => {
      window.__soundManager__?.setSounds(e.target.checked);
      const slider = document.getElementById('ls-sounds-slider');
      slider.style.background = e.target.checked ? '#6633ff' : '#333';
      slider.querySelector('span').style.left = e.target.checked ? '23px' : '3px';
    };

    document.getElementById('ls-music').onchange = (e) => {
      window.__soundManager__?.setMusic(e.target.checked);
      const slider = document.getElementById('ls-music-slider');
      slider.style.background = e.target.checked ? '#6633ff' : '#333';
      slider.querySelector('span').style.left = e.target.checked ? '23px' : '3px';
    };

    // Restart
    document.getElementById('ls-restart').onclick = () => {
      if (confirm('Are you sure? All progress will be lost.')) {
        window.__progress__?.reset();
        overlay.remove();
        this._settingsOpen = false;
        this.scene.start('GameScene', { levelIndex: 0 });
      }
    };

    // Close
    const close = () => {
      overlay.remove();
      this._settingsOpen = false;
    };
    document.getElementById('ls-close').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    // Privacy
    document.getElementById('ls-privacy').onclick = (e) => {
      e.preventDefault();
      window.open('https://panosdev323.github.io/tower-eater/privacy-policy.html', '_blank');
    };
  }

  showWin(cx) {
    const nextLevel = this.levelData.id + 1;
    const hasNext   = nextLevel <= TOTAL_LEVELS;

    this.add.text(cx, 160, '✅ LEVEL CLEAR', {
      fontSize: '36px', color: '#ffdd00', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 218, this.levelData.name, {
      fontSize: '20px', color: '#aaaaaa'
    }).setOrigin(0.5);

    // Stats
    this.add.text(cx, 290, '— Stats —', {
      fontSize: '15px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(cx, 322, `HP remaining: ${this.stats.hp} / ${this.stats.maxHp}`, {
      fontSize: '15px', color: '#00ff88'
    }).setOrigin(0.5);

    this.add.text(cx, 350, `Towers eaten: ${this.stats.eaten}`, {
      fontSize: '15px', color: '#ffaa00'
    }).setOrigin(0.5);

    this.add.text(cx, 378, `Power reached: ${this.stats.power}`, {
      fontSize: '15px', color: '#aa44ff'
    }).setOrigin(0.5);

    const evoIcons = this.stats.evolutions
      .map(e => ({ fire:'🔥', ice:'❄️', arcane:'✨' }[e])).join(' ');
    this.add.text(cx, 410, `Absorbed: ${evoIcons || 'none'}`, {
      fontSize: '16px'
    }).setOrigin(0.5);

    if (hasNext) {
      // Next level button
      const btn = this.add.text(cx, 510, '▶  NEXT LEVEL', {
        fontSize: '28px', color: '#ffffff',
        backgroundColor: '#1a3a1a',
        padding: { x: 28, y: 14 }
      }).setOrigin(0.5).setInteractive();
      btn.on('pointerover', () => btn.setColor('#ffdd00'));
      btn.on('pointerout',  () => btn.setColor('#ffffff'));
      btn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: nextLevel - 1 });
      });

      this.add.text(cx, 578, `Level ${nextLevel} / ${TOTAL_LEVELS}`, {
        fontSize: '14px', color: '#555555'
      }).setOrigin(0.5);

      // Settings στο LevelScene
      const settingsInline = this.add.text(cx, 630, '⚙️ Settings', {
        fontSize: '16px', color: '#555555',
        backgroundColor: '#111111',
        padding: { x: 16, y: 8 }
      }).setOrigin(0.5).setInteractive();
      settingsInline.on('pointerover', () => settingsInline.setColor('#aaaaaa'));
      settingsInline.on('pointerout',  () => settingsInline.setColor('#555555'));
      settingsInline.on('pointerdown', () => this._openSettings());

    } else {
      this.add.text(cx, 500, '🏆 ALL LEVELS COMPLETE!', {
        fontSize: '26px', color: '#ffdd00', fontStyle: 'bold'
      }).setOrigin(0.5);

      const btn = this.add.text(cx, 580, '↺  PLAY AGAIN', {
        fontSize: '24px', color: '#ffffff',
        backgroundColor: '#1a1a3a',
        padding: { x: 24, y: 12 }
      }).setOrigin(0.5).setInteractive();
      btn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: 0 });
      });
    }

    const retryBtn = this.add.text(cx, 700, 'retry level', {
      fontSize: '15px', color: '#444444'
    }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });
  }

  showDeath(cx) {
    this.add.text(cx, 180, '💀 YOU DIED', {
      fontSize: '40px', color: '#ff4444', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 240, this.levelData.name, {
      fontSize: '20px', color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(cx, 310, `Towers eaten: ${this.stats.eaten}`, {
      fontSize: '17px', color: '#ffaa00'
    }).setOrigin(0.5);

    const evoIcons = this.stats.evolutions
      .map(e => ({ fire:'🔥', ice:'❄️', arcane:'✨' }[e])).join(' ');
    this.add.text(cx, 348, `Absorbed: ${evoIcons || 'none'}`, {
      fontSize: '17px'
    }).setOrigin(0.5);

    const retryBtn = this.add.text(cx, 460, '↺  RETRY', {
      fontSize: '28px', color: '#ffffff',
      backgroundColor: '#3a1111',
      padding: { x: 28, y: 14 }
    }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerover', () => retryBtn.setColor('#ff4444'));
    retryBtn.on('pointerout',  () => retryBtn.setColor('#ffffff'));
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });

    // Settings
    const settingsInline = this.add.text(cx, 560, '⚙️ Settings', {
      fontSize: '16px', color: '#555555',
      backgroundColor: '#111111',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive();
    settingsInline.on('pointerover', () => settingsInline.setColor('#aaaaaa'));
    settingsInline.on('pointerout',  () => settingsInline.setColor('#555555'));
    settingsInline.on('pointerdown', () => this._openSettings());

    const menuBtn = this.add.text(cx, 640, 'level select', {
      fontSize: '15px', color: '#444444'
    }).setOrigin(0.5).setInteractive();
    menuBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });
  }
}