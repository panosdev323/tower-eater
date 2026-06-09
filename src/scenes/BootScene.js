import { SpriteFactory } from '../systems/SpriteFactory.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { IntroScreen } from '../ui/IntroScreen.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const bar = this.add.rectangle(240, 427, 4, 20, 0x00ff88);
    this.tweens.add({ targets: bar, scaleX: 60, duration: 800, ease: 'Power2' });
  }

  create() {
    SpriteFactory.preloadAll(this);

    this.time.delayedCall(300, () => {
      // Έλεγξε αν είναι η πρώτη φορά
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