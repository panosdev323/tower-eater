import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { LevelScene } from './scenes/LevelScene.js';
import { PauseMenu } from './ui/PauseMenu.js';

// Global access για το GameScene
window.__PauseMenuClass__ = { PauseMenu };

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 854,
  backgroundColor: '#1a1a2e',
  scene: [BootScene, GameScene, LevelScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

new Phaser.Game(config);