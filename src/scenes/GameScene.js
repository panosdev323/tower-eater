export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.add.text(240, 400, 'TowerEater', {
      fontSize: '48px',
      color: '#ff4444',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(240, 460, 'You are the monster.', {
      fontSize: '20px',
      color: '#aaaaaa',
    }).setOrigin(0.5);
  }
}