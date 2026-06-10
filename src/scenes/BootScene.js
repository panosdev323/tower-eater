// import { AdManager } from '../systems/AdManager.js';
import { SpriteFactory } from '../systems/SpriteFactory.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { IntroScreen } from '../ui/IntroScreen.js';

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

  create() {
    // AdManager.initialize();
    // Small delay so the loading bar flash isn't jarring
    this.time.delayedCall(200, () => {
      const isFirstTime = !localStorage.getItem('te_seen_intro');

      if (isFirstTime) {
        localStorage.setItem('te_seen_intro', 'true');
        new IntroScreen((levelIndex) => {
          this.scene.start('GameScene', { levelIndex });
        });
      } else {
        const savedLevel = ProgressManager.getSavedLevel();
        this.scene.start('GameScene', { levelIndex: savedLevel });
      }
    });
  }
}