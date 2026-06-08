import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { LevelScene } from './scenes/LevelScene.js';
import { PauseMenu } from './ui/PauseMenu.js';
import { soundManager } from './systems/SoundManager.js';
import { ProgressManager } from './systems/ProgressManager.js';

window.__PauseMenuClass__ = { PauseMenu };
window.__soundManager__   = soundManager;
window.__progress__       = ProgressManager;

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