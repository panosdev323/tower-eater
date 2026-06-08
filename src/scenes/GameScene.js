import { PathFinder } from '../systems/PathFinder.js';
import { LEVELS } from '../data/levels.js';

const TOWER_COLORS = {
  fire:   0xff4444,
  ice:    0x44aaff,
  arcane: 0xaa44ff,
};

const TOWER_ICONS = {
  fire: '🔥',
  ice:  '❄️',
  arcane: '✨',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelIndex = data?.levelIndex ?? 0;
  }

  create() {
    this.level = LEVELS[this.levelIndex];

    this.tileSize = 48;
    this.cols = 10;
    this.rows = 16;
    this.offsetX = (480 - this.cols * this.tileSize) / 2;
    this.offsetY = (854 - this.rows * this.tileSize) / 2;

    this.monsterHP = 100;
    this.monsterMaxHP = 100;
    this.monsterPower = 1;
    this.monsterArmor = 0;
    this.monsterSpeed = 150;
    this.monsterRadius = 18;
    this.monsterColor = 0x00ff88;
    this.evolutions = [];
    this.towersEaten = 0;
    this.gameOver = false;

    this.drawGrid();
    this.createMonster();
    this.createTowers();
    this.createBase();
    this.createUI();
    this.setupInput();
    this.updatePath();

    this.time.addEvent({
      delay: this.level.shootDelay,
      callback: this.towerShoot,
      callbackScope: this,
      loop: true
    });
  }

  drawGrid() {
    const g = this.add.graphics();
    g.lineStyle(1, 0x333355, 1);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        g.strokeRect(
          this.offsetX + c * this.tileSize,
          this.offsetY + r * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  createMonster() {
    this.monsterCell = { col: 1, row: 13 };
    const pos = this.cellToPixel(this.monsterCell);
    this.monster = this.add.circle(pos.x, pos.y, this.monsterRadius, this.monsterColor).setDepth(5);
    this.monsterRing = this.add.circle(pos.x, pos.y, this.monsterRadius + 6, this.monsterColor, 0.2).setDepth(4);
  }

  createTowers() {
    this.towers = [];
    this.level.towers.forEach(td => {
      const pos = this.cellToPixel(td);
      const color = TOWER_COLORS[td.type];
      const rect = this.add.rectangle(pos.x, pos.y, 36, 36, color).setDepth(3);
      const label = this.add.text(pos.x, pos.y, TOWER_ICONS[td.type], {
        fontSize: '16px'
      }).setOrigin(0.5).setDepth(4);
      const hpBar = this.add.rectangle(pos.x, pos.y - 26, 36, 5, 0x00ff00).setDepth(4);

      this.towers.push({
        cell: { col: td.col, row: td.row },
        sprite: rect, label, hpBar,
        hp: 3, maxHp: 3,
        type: td.type, color
      });
    });
  }

  createBase() {
    this.baseCell = { col: 5, row: 1 };
    const pos = this.cellToPixel(this.baseCell);
    this.base = this.add.rectangle(pos.x, pos.y, 60, 60, 0xffdd00).setDepth(3);
    this.add.text(pos.x, pos.y, 'BASE', {
      fontSize: '12px', color: '#000000'
    }).setOrigin(0.5).setDepth(4);
  }

  createUI() {
    // Level name
    this.add.text(240, 6, `Level ${this.level.id}: ${this.level.name}`, {
      fontSize: '13px', color: '#aaaaaa'
    }).setOrigin(0.5).setDepth(10);

    this.hpBarBg = this.add.rectangle(240, 22, 300, 12, 0x333333).setDepth(10);
    this.hpBar = this.add.rectangle(91, 22, 300, 12, 0x00ff88).setDepth(11).setOrigin(0, 0.5);
    this.hpText = this.add.text(240, 22, 'HP: 100', {
      fontSize: '10px', color: '#000000'
    }).setOrigin(0.5).setDepth(12);

    this.powerText = this.add.text(10, 36, '⚔️ PWR: 1', {
      fontSize: '14px', color: '#ffaa00'
    }).setDepth(10);
    this.armorText = this.add.text(10, 54, '🛡️ ARM: 0', {
      fontSize: '14px', color: '#44aaff'
    }).setDepth(10);
    this.speedText = this.add.text(10, 72, '💨 SPD: 1.0x', {
      fontSize: '14px', color: '#aaffaa'
    }).setDepth(10);

    this.evoText = this.add.text(240, 820, '', {
      fontSize: '13px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(10);

    this.pathVisible = true;
    const btn = this.add.text(465, 36, '🗺️', {
      fontSize: '22px'
    }).setOrigin(1, 0).setDepth(10).setInteractive();
    btn.on('pointerdown', () => {
      this.pathVisible = !this.pathVisible;
      this.pathGraphics.setVisible(this.pathVisible);
    });
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (this.gameOver) return;
      const col = Math.floor((pointer.x - this.offsetX) / this.tileSize);
      const row = Math.floor((pointer.y - this.offsetY) / this.tileSize);
      if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
      const dc = Math.abs(col - this.monsterCell.col);
      const dr = Math.abs(row - this.monsterCell.row);
      if (dc + dr !== 1) return;
      this.moveMonster({ col, row });
    });
  }

  moveMonster(targetCell) {
    this.monsterCell = targetCell;
    const pos = this.cellToPixel(targetCell);
    this.tweens.add({
      targets: [this.monster, this.monsterRing],
      x: pos.x, y: pos.y,
      duration: this.monsterSpeed,
      ease: 'Power2',
      onComplete: () => {
        this.checkCollisions();
        this.updatePath();
      }
    });
  }

  evolve(towerType) {
    const evoDefs = {
      fire: {
        label: '🔥 Fire Absorbed! +Speed',
        color: 0xff6600,
        apply: () => {
          this.monsterSpeed = Math.max(60, this.monsterSpeed - 25);
          this.speedText.setText('💨 SPD: ' + (150 / this.monsterSpeed).toFixed(1) + 'x');
        }
      },
      ice: {
        label: '❄️ Ice Absorbed! +Armor',
        color: 0x66ccff,
        apply: () => {
          this.monsterArmor = Math.min(80, this.monsterArmor + 20);
          this.armorText.setText('🛡️ ARM: ' + this.monsterArmor);
        }
      },
      arcane: {
        label: '✨ Arcane Absorbed! +Power',
        color: 0xcc66ff,
        apply: () => {
          this.monsterPower += 2;
          this.monsterMaxHP += 20;
          this.monsterHP = Math.min(this.monsterMaxHP, this.monsterHP + 20);
          this.powerText.setText('⚔️ PWR: ' + this.monsterPower);
        }
      }
    };

    const evo = evoDefs[towerType];
    if (!evo) return;
    evo.apply();
    this.evolutions.push(towerType);
    this.towersEaten++;
    this.monsterColor = evo.color;
    this.monster.setFillStyle(this.monsterColor);
    this.monsterRing.setFillStyle(this.monsterColor);
    this.monsterRadius = 18 + this.evolutions.length * 3;
    this.monster.setRadius(this.monsterRadius);
    this.monsterRing.setRadius(this.monsterRadius + 6);

    this.evoText.setText(evo.label);
    this.time.delayedCall(2000, () => this.evoText.setText(''));

    this.tweens.add({
      targets: this.monster,
      scaleX: 1.4, scaleY: 1.4,
      duration: 200, yoyo: true, ease: 'Power2'
    });
  }

  towerShoot() {
    if (this.gameOver) return;
    this.towers.forEach(tower => {
      const from = this.cellToPixel(tower.cell);
      const bullet = this.add.circle(from.x, from.y, 5, tower.color).setDepth(6);
      this.tweens.add({
        targets: bullet,
        x: this.monster.x, y: this.monster.y,
        duration: 600, ease: 'Linear',
        onComplete: () => {
          bullet.destroy();
          const raw = 10;
          const reduced = Math.floor(raw * (1 - this.monsterArmor / 100));
          this.takeDamage(reduced);
        }
      });
    });
  }

  takeDamage(amount) {
    if (this.gameOver) return;
    this.monsterHP = Math.max(0, this.monsterHP - amount);
    const ratio = this.monsterHP / this.monsterMaxHP;
    this.hpBar.setScale(ratio, 1);
    this.hpBar.setFillStyle(ratio > 0.5 ? 0x00ff88 : ratio > 0.25 ? 0xffaa00 : 0xff4444);
    this.hpText.setText('HP: ' + this.monsterHP + ' / ' + this.monsterMaxHP);
    this.monster.setFillStyle(0xffffff);
    this.time.delayedCall(100, () => this.monster.setFillStyle(this.monsterColor));
    if (this.monsterHP <= 0) this.endGame(false);
  }

  checkCollisions() {
    if (this.gameOver) return;
    if (this.monsterCell.col === this.baseCell.col &&
        this.monsterCell.row === this.baseCell.row) {
      this.endGame(true);
      return;
    }
    for (let i = this.towers.length - 1; i >= 0; i--) {
      const tower = this.towers[i];
      if (tower.cell.col === this.monsterCell.col &&
          tower.cell.row === this.monsterCell.row) {
        tower.hp -= this.monsterPower;
        const ratio = Math.max(0, tower.hp / tower.maxHp);
        tower.hpBar.setScale(ratio, 1);
        tower.hpBar.setFillStyle(ratio > 0.5 ? 0x00ff00 : 0xff4400);
        if (tower.hp <= 0) {
          tower.sprite.destroy();
          tower.hpBar.destroy();
          tower.label.destroy();
          this.evolve(tower.type);
          this.towers.splice(i, 1);
          this.cameras.main.shake(250, 0.012);
        }
        break;
      }
    }
  }

  updatePath() {
    if (!this.pathGraphics) {
      this.pathGraphics = this.add.graphics().setDepth(1);
    }
    this.pathGraphics.clear();
    const blocked = this.towers.map(t => t.cell);
    const path = PathFinder.findPath(
      this.monsterCell, this.baseCell,
      this.cols, this.rows, blocked
    );
    if (path.length === 0) {
      this.pathGraphics.fillStyle(0xff0000, 0.2);
      const mp = this.cellToPixel(this.monsterCell);
      this.pathGraphics.fillCircle(mp.x, mp.y, 28);
      return;
    }
    path.forEach((cell, i) => {
      const alpha = 0.3 - (i / path.length) * 0.2;
      this.pathGraphics.fillStyle(0x00ffff, alpha);
      this.pathGraphics.fillRect(
        this.offsetX + cell.col * this.tileSize + 4,
        this.offsetY + cell.row * this.tileSize + 4,
        this.tileSize - 8, this.tileSize - 8
      );
    });
    if (path.length > 0) {
      const next = path[0];
      const pos = this.cellToPixel(next);
      this.pathGraphics.fillStyle(0x00ffff, 0.6);
      this.pathGraphics.fillCircle(pos.x, pos.y, 8);
    }
    this.pathGraphics.setVisible(this.pathVisible);
  }

  endGame(win) {
    this.gameOver = true;
    this.input.off('pointerdown');
    this.scene.start('LevelScene', {
      level: this.level,
      win,
      stats: {
        hp: this.monsterHP,
        maxHp: this.monsterMaxHP,
        eaten: this.towersEaten,
        power: this.monsterPower,
        evolutions: this.evolutions
      }
    });
  }

  cellToPixel(cell) {
    return {
      x: this.offsetX + cell.col * this.tileSize + this.tileSize / 2,
      y: this.offsetY + cell.row * this.tileSize + this.tileSize / 2,
    };
  }
}