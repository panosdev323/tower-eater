import { SpriteFactory } from '../systems/SpriteFactory.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Loading bar
    const bar = this.add.rectangle(240, 427, 4, 20, 0x00ff88);
    this.tweens.add({
      targets: bar, scaleX: 60, duration: 800, ease: 'Power2'
    });
  }

  create() {
    SpriteFactory.preloadAll(this);

    // Μικρό delay για να φορτώσουν τα textures
    this.time.delayedCall(300, () => {
      this.scene.start('GameScene', { levelIndex: 0 });
    });
  }
}