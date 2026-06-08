export class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data) {
    this.levelData = data.level;
    this.win = data.win;
    this.stats = data.stats;
  }

  create() {
    const cx = 240;

    // Background
    this.add.rectangle(cx, 427, 480, 854, 0x0a0a1a);

    if (this.win) {
      this.showWin(cx);
    } else {
      this.showDeath(cx);
    }
  }

  showWin(cx) {
    const nextLevel = this.levelData.id + 1;
    const hasNext = nextLevel <= 50;

    this.add.text(cx, 180, '✅ LEVEL CLEAR', {
      fontSize: '36px', color: '#ffdd00', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 240, this.levelData.name, {
      fontSize: '22px', color: '#aaaaaa'
    }).setOrigin(0.5);

    // Stats
    this.add.text(cx, 320, '— Stats —', {
      fontSize: '16px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(cx, 355, `HP remaining: ${this.stats.hp} / ${this.stats.maxHp}`, {
      fontSize: '16px', color: '#00ff88'
    }).setOrigin(0.5);

    this.add.text(cx, 385, `Towers eaten: ${this.stats.eaten}`, {
      fontSize: '16px', color: '#ffaa00'
    }).setOrigin(0.5);

    this.add.text(cx, 415, `Power reached: ${this.stats.power}`, {
      fontSize: '16px', color: '#aa44ff'
    }).setOrigin(0.5);

    const evoIcons = this.stats.evolutions
      .map(e => ({ fire: '🔥', ice: '❄️', arcane: '✨' }[e]))
      .join(' ');
    this.add.text(cx, 455, `Absorbed: ${evoIcons || 'none'}`, {
      fontSize: '18px'
    }).setOrigin(0.5);

    if (hasNext) {
      const btn = this.add.text(cx, 560, '▶  NEXT LEVEL', {
        fontSize: '28px', color: '#ffffff',
        backgroundColor: '#224422',
        padding: { x: 24, y: 12 }
      }).setOrigin(0.5).setInteractive();

      btn.on('pointerover', () => btn.setColor('#ffdd00'));
      btn.on('pointerout', () => btn.setColor('#ffffff'));
      btn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: nextLevel - 1 });
      });

      this.add.text(cx, 630, `Level ${nextLevel} / 50`, {
        fontSize: '16px', color: '#666666'
      }).setOrigin(0.5);
    } else {
      this.add.text(cx, 540, '🏆 ALL LEVELS COMPLETE!', {
        fontSize: '26px', color: '#ffdd00', fontStyle: 'bold'
      }).setOrigin(0.5);

      const btn = this.add.text(cx, 620, '↺  PLAY AGAIN', {
        fontSize: '24px', color: '#ffffff',
        backgroundColor: '#222244',
        padding: { x: 24, y: 12 }
      }).setOrigin(0.5).setInteractive();

      btn.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: 0 });
      });
    }

    const retryBtn = this.add.text(cx, 720, 'retry level', {
      fontSize: '16px', color: '#555555'
    }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });
  }

  showDeath(cx) {
    this.add.text(cx, 200, '💀 YOU DIED', {
      fontSize: '40px', color: '#ff4444', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 260, this.levelData.name, {
      fontSize: '22px', color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(cx, 340, `Towers eaten: ${this.stats.eaten}`, {
      fontSize: '18px', color: '#ffaa00'
    }).setOrigin(0.5);

    const evoIcons = this.stats.evolutions
      .map(e => ({ fire: '🔥', ice: '❄️', arcane: '✨' }[e]))
      .join(' ');
    this.add.text(cx, 380, `Absorbed: ${evoIcons || 'none'}`, {
      fontSize: '18px'
    }).setOrigin(0.5);

    const retryBtn = this.add.text(cx, 500, '↺  RETRY', {
      fontSize: '28px', color: '#ffffff',
      backgroundColor: '#442222',
      padding: { x: 24, y: 12 }
    }).setOrigin(0.5).setInteractive();

    retryBtn.on('pointerover', () => retryBtn.setColor('#ff4444'));
    retryBtn.on('pointerout', () => retryBtn.setColor('#ffffff'));
    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });

    const menuBtn = this.add.text(cx, 600, 'level select', {
      fontSize: '16px', color: '#555555'
    }).setOrigin(0.5).setInteractive();
    menuBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { levelIndex: this.levelData.id - 1 });
    });
  }
}