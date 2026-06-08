import { SpriteFactory } from '../systems/SpriteFactory.js';
import { ProgressManager } from '../systems/ProgressManager.js';

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
      const savedLevel = ProgressManager.getSavedLevel();
      this.scene.start('GameScene', { levelIndex: savedLevel });
    });
  }
}