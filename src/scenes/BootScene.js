export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // assets εδώ αργότερα
  }

  create() {
    this.scene.start('GameScene');
  }
}