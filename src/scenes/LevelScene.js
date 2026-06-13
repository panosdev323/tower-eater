import { TOTAL_LEVELS } from '../data/levels.js';
import { ProgressManager } from '../systems/ProgressManager.js';

export class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data) {
    this.levelData   = data.level;
    this.win         = data.win;
    this.stats       = data.stats;
    this.isEndless   = data.isEndless ?? false;
    this.endlessWave = data.endlessWave ?? 0;
  }

  create() {
    window.removeEventListener('pauseGame',  window.__lastPauseHandler__);
    window.removeEventListener('resumeGame', window.__lastResumeHandler__);

    const cx = 240;
    this.add.rectangle(cx, 427, 480, 854, 0x0a0a1a);

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

    document.getElementById('ls-restart').onclick = () => {
      if (confirm('Are you sure? All progress will be lost.')) {
        ProgressManager.reset();
        overlay.remove();
        this._settingsOpen = false;
        this.scene.start('GameScene', { levelIndex: 0 });
      }
    };

    const close = () => {
      overlay.remove();
      this._settingsOpen = false;
    };
    document.getElementById('ls-close').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    document.getElementById('ls-privacy').onclick = (e) => {
      e.preventDefault();
      window.open('https://panosdev323.github.io/tower-eater/privacy-policy.html', '_blank');
    };
  }

  showWin(cx) {
    // ── ENDLESS WIN ──────────────────────────────────────
    if (this.isEndless) {
      this.add.text(cx, 120, `🌀 WAVE ${this.endlessWave} CLEAR!`, {
        fontSize: '34px', color: '#ff44ff', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(cx, 178, this.levelData.name, {
        fontSize: '18px', color: '#aaaaaa'
      }).setOrigin(0.5);

      const best = ProgressManager.getBestEndlessWave();
      this.add.text(cx, 220, `Best Wave: ${best}`, {
        fontSize: '16px', color: '#ff44ff'
      }).setOrigin(0.5);

      this.add.text(cx, 262, `HP: ${this.stats.hp} / ${this.stats.maxHp}`, {
        fontSize: '15px', color: '#00ff88'
      }).setOrigin(0.5);

      this.add.text(cx, 298, `Towers eaten: ${this.stats.eaten}`, {
        fontSize: '15px', color: '#ffaa00'
      }).setOrigin(0.5);

      const btn = this.add.text(cx, 390, '▶  NEXT WAVE', {
        fontSize: '28px', color: '#ffffff',
        backgroundColor: '#2a003a',
        padding: { x: 28, y: 14 }
      }).setOrigin(0.5).setInteractive();
      btn.on('pointerover', () => btn.setColor('#ff44ff'));
      btn.on('pointerout',  () => btn.setColor('#ffffff'));
      btn.on('pointerdown', () => {
        this.scene.start('GameScene', {
          isEndless: true,
          endlessWave: this.endlessWave + 1
        });
      });

      const quitBtn = this.add.text(cx, 490, 'quit to menu', {
        fontSize: '16px', color: '#444444'
      }).setOrigin(0.5).setInteractive();
      quitBtn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: 0 });
      });
      return;
    }

    // ── NORMAL WIN ───────────────────────────────────────
    const nextLevel = this.levelData.id + 1;
    const hasNext   = nextLevel <= TOTAL_LEVELS;

    this.add.text(cx, 100, '✅ LEVEL CLEAR', {
      fontSize: '36px', color: '#ffdd00', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 155, this.levelData.name, {
      fontSize: '20px', color: '#aaaaaa', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 220, '— Stats —', {
      fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 258, `HP remaining: ${this.stats.hp} / ${this.stats.maxHp}`, {
      fontSize: '16px', color: '#00ff88', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 292, `Towers eaten: ${this.stats.eaten}`, {
      fontSize: '16px', color: '#ffaa00', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 326, `Power reached: ${this.stats.power}`, {
      fontSize: '16px', color: '#aa44ff', fontStyle: 'bold'
    }).setOrigin(0.5);

    const evoIcons = this.stats.evolutions
      .map(e => ({ fire:'🔥', ice:'❄️', arcane:'✨', poison:'🧪' }[e])).join(' ');
    this.add.text(cx, 362, `Absorbed: ${evoIcons || 'none'}`, {
      fontSize: '17px', fontStyle: 'bold'
    }).setOrigin(0.5);

    if (hasNext) {
      const btn = this.add.text(cx, 450, '▶  NEXT LEVEL', {
        fontSize: '28px', color: '#ffffff',
        backgroundColor: '#1a3a1a',
        padding: { x: 28, y: 14 }
      }).setOrigin(0.5).setInteractive();
      btn.on('pointerover', () => btn.setColor('#ffdd00'));
      btn.on('pointerout',  () => btn.setColor('#ffffff'));
      btn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: nextLevel - 1 });
      });

      this.add.text(cx, 518, `Level ${nextLevel} / ${TOTAL_LEVELS}`, {
        fontSize: '15px', color: '#b4b4b4', fontStyle: 'bold'
      }).setOrigin(0.5);

      const settingsInline = this.add.text(cx, 570, '⚙️ Settings', {
        fontSize: '16px', color: '#b4b4b4', fontStyle: 'bold',
        backgroundColor: '#111111',
        padding: { x: 16, y: 8 }
      }).setOrigin(0.5).setInteractive();
      settingsInline.on('pointerover', () => settingsInline.setColor('#aaaaaa'));
      settingsInline.on('pointerout',  () => settingsInline.setColor('#555555'));
      settingsInline.on('pointerdown', () => this._openSettings());

    } else {
      this.add.text(cx, 430, '🏆 ALL 120 LEVELS COMPLETE!', {
        fontSize: '22px', color: '#ffdd00', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(cx, 472, 'You are ready for the endless.', {
        fontSize: '16px', color: '#aaaaaa', fontStyle: 'bold'
      }).setOrigin(0.5);

      const endlessBtn = this.add.text(cx, 538, '🌀  START ENDLESS', {
        fontSize: '26px', color: '#000000', fontStyle: 'bold',
        backgroundColor: '#ff44ff',
        padding: { x: 24, y: 14 }
      }).setOrigin(0.5).setInteractive();
      endlessBtn.on('pointerover', () => endlessBtn.setStyle({ color: '#ffffff' }));
      endlessBtn.on('pointerout',  () => endlessBtn.setStyle({ color: '#000000' }));
      endlessBtn.on('pointerdown', () => {
        this.scene.start('GameScene', { isEndless: true, endlessWave: 1 });
      });

      const replayBtn = this.add.text(cx, 626, '↺ play from start', {
        fontSize: '16px', color: '#444444', fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive();
      replayBtn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: 0 });
      });
    }

    const retryBtn = this.add.text(cx, 650, 'retry level', {
      fontSize: '16px', color: '#b4b4b4', fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });
  }

  showDeath(cx) {
    // ── ENDLESS DEATH ─────────────────────────────────────
    if (this.isEndless) {
      const best = ProgressManager.getBestEndlessWave();

      this.add.text(cx, 160, '💀 WAVE FAILED', {
        fontSize: '36px', color: '#ff4444', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(cx, 220, `Wave ${this.endlessWave}`, {
        fontSize: '22px', color: '#ff44ff'
      }).setOrigin(0.5);

      this.add.text(cx, 270, `Best Wave: ${best}`, {
        fontSize: '18px', color: '#ffdd00'
      }).setOrigin(0.5);

      this.add.text(cx, 318, `Towers eaten: ${this.stats.eaten}`, {
        fontSize: '16px', color: '#ffaa00'
      }).setOrigin(0.5);

      const retryBtn = this.add.text(cx, 420, '↺  RETRY WAVE', {
        fontSize: '26px', color: '#ffffff',
        backgroundColor: '#3a0011',
        padding: { x: 28, y: 14 }
      }).setOrigin(0.5).setInteractive();
      retryBtn.on('pointerover', () => retryBtn.setColor('#ff44ff'));
      retryBtn.on('pointerout',  () => retryBtn.setColor('#ffffff'));
      retryBtn.on('pointerdown', () => {
        this.scene.start('GameScene', {
          isEndless: true,
          endlessWave: this.endlessWave
        });
      });

      const startOverBtn = this.add.text(cx, 510, '🌀 Start from Wave 1', {
        fontSize: '16px', color: '#555555',
        backgroundColor: '#111111',
        padding: { x: 16, y: 8 }
      }).setOrigin(0.5).setInteractive();
      startOverBtn.on('pointerdown', () => {
        this.scene.start('GameScene', { isEndless: true, endlessWave: 1 });
      });

      const quitBtn = this.add.text(cx, 590, 'quit to normal levels', {
        fontSize: '15px', color: '#444444'
      }).setOrigin(0.5).setInteractive();
      quitBtn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: 0 });
      });
      return;
    }

    // ── NORMAL DEATH ──────────────────────────────────────
    this.add.text(cx, 180, '💀 YOU DIED', {
      fontSize: '40px', color: '#ff4444', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 240, this.levelData.name, {
      fontSize: '20px', color: '#aaaaaa', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 310, `Towers eaten: ${this.stats.eaten}`, {
      fontSize: '17px', color: '#ffaa00', fontStyle: 'bold'
    }).setOrigin(0.5);

    const evoIcons = this.stats.evolutions
      .map(e => ({ fire:'🔥', ice:'❄️', arcane:'✨', poison:'🧪' }[e])).join(' ');
    this.add.text(cx, 348, `Absorbed: ${evoIcons || 'none'}`, {
      fontSize: '17px'
    }).setOrigin(0.5);

    const retryBtn = this.add.text(cx, 460, '↺  RETRY', {
      fontSize: '28px', color: '#ffffff', fontStyle: 'bold',
      backgroundColor: '#3a1111',
      padding: { x: 28, y: 14 }
    }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerover', () => retryBtn.setColor('#ff4444'));
    retryBtn.on('pointerout',  () => retryBtn.setColor('#ffffff'));
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });

    const settingsInline = this.add.text(cx, 560, '⚙️ Settings', {
      fontSize: '16px', color: '#aaaaaa', fontStyle: 'bold',
      backgroundColor: '#111111',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive();
    settingsInline.on('pointerover', () => settingsInline.setColor('#aaaaaa'));
    settingsInline.on('pointerout',  () => settingsInline.setColor('#555555'));
    settingsInline.on('pointerdown', () => this._openSettings());

    const menuBtn = this.add.text(cx, 640, 'level select', {
      fontSize: '15px', color: '#444444', fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive();
    menuBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });
  }
}