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
    const { PauseMenu } = window.__PauseMenuClass__;
    if (!this.pauseMenu) {
      this.pauseMenu = new PauseMenu(
        () => {},
        () => {
          this.pauseMenu.destroy();
          this.pauseMenu = null;
          // Start over → Level 1
          this.scene.start('GameScene', { levelIndex: 0 });
        },
        (musicOn) => { console.log('Music:', musicOn); }
      );
    }
    this.pauseMenu.show();
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