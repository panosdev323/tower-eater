import { PathFinder } from '../systems/PathFinder.js';
import { LEVELS } from '../data/levels.js';
import { SpriteFactory } from '../systems/SpriteFactory.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelIndex = data?.levelIndex ?? 0;
  }

  create() {
    this.level = LEVELS[this.levelIndex];
    this.world = this.level.world;
    this.theme = SpriteFactory.getWorldTheme(this.world);

    this.tileSize = 48;
    this.cols = 10;
    this.rows = 16;
    this.offsetX = (480 - this.cols * this.tileSize) / 2;
    this.offsetY = (854 - this.rows * this.tileSize) / 2;

    this.monsterHP     = 100;
    this.monsterMaxHP  = 100;
    this.monsterPower  = 1;
    this.monsterArmor  = 0;
    this.monsterSpeed  = 150;
    this.evolutions    = [];
    this.towersEaten   = 0;
    this.baseUnlocked  = false;
    this.isMoving      = false;
    this.gameOver      = false;

    // Background
    this.add.rectangle(240, 427, 480, 854, parseInt(this.theme.bg.replace('#',''), 16));

    this.drawGrid();
    this.createBase();
    this.createTowers();
    this.createMonster();
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
    // Terrain tiles
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.tileSize;
        const y = this.offsetY + r * this.tileSize;
        this.add.image(x + 24, y + 24, `terrain_${this.world}`).setDepth(0);
      }
    }
  }

  createMonster() {
    this.monsterCell = { col: 1, row: 13 };
    const pos = this.cellToPixel(this.monsterCell);
    this.monsterSprite = this.add.image(pos.x, pos.y, 'monster').setDepth(5);
    this.monsterGlow   = this.add.circle(pos.x, pos.y, 26, 0x00ff88, 0.15).setDepth(4);
  }

  createTowers() {
    this.towers = [];
    this.level.towers.forEach(td => {
      const pos      = this.cellToPixel(td);
      const textureKey = `tower_${td.type}_${this.world}`;
      const sprite   = this.add.image(pos.x, pos.y, textureKey).setDepth(3);
      const hpBarBg  = this.add.rectangle(pos.x, pos.y - 28, 36, 5, 0x333333).setDepth(4);
      const hpBar    = this.add.rectangle(pos.x - 18, pos.y - 28, 36, 5, 0x00ff00).setDepth(5).setOrigin(0, 0.5);
      this.towers.push({
        cell: { col: td.col, row: td.row },
        sprite, hpBarBg, hpBar,
        hp: 3, maxHp: 3,
        type: td.type
      });
    });
  }

  createBase() {
    this.baseCell = { col: 5, row: 1 };
    const pos = this.cellToPixel(this.baseCell);

    this.baseSprLocked   = this.add.image(pos.x, pos.y, 'base_locked').setDepth(3);
    this.baseSprUnlocked = this.add.image(pos.x, pos.y, `base_${this.world}`).setDepth(3).setVisible(false);
  }

  createUI() {
    // World indicator
    const worldIcons = { dungeon:'⚔️', forest:'🌿', volcanic:'🌋', frozen:'❄️', void:'💀' };
    this.add.text(10, 6, `${worldIcons[this.world]} ${this.level.name}`, {
      fontSize: '13px', color: '#aaaaaa'
    }).setDepth(10);

    // Level number
    this.add.text(470, 6, `Lv.${this.level.id}`, {
      fontSize: '13px', color: '#666666'
    }).setOrigin(1, 0).setDepth(10);

    // HP bar
    this.add.rectangle(240, 24, 302, 14, 0x222222).setDepth(10);
    this.hpBarFill = this.add.rectangle(90, 24, 300, 12, 0x00ff88).setDepth(11).setOrigin(0, 0.5);
    this.hpText    = this.add.text(240, 24, 'HP 100', { fontSize: '10px', color: '#000' }).setOrigin(0.5).setDepth(12);

    // Stats row
    this.powerText = this.add.text(10,  42, '⚔️ 1',   { fontSize: '13px', color: '#ffaa00' }).setDepth(10);
    this.armorText = this.add.text(70,  42, '🛡️ 0%', { fontSize: '13px', color: '#44aaff' }).setDepth(10);
    this.speedText = this.add.text(140, 42, '💨 1x',  { fontSize: '13px', color: '#aaffaa' }).setDepth(10);

    // Eat counter
    this.eatCounter = this.add.text(470, 42, `🍴 0/${this.level.required}`, {
      fontSize: '16px', color: '#ffffff'
    }).setOrigin(1, 0).setDepth(10);

    // Message line
    this.msgText = this.add.text(240, 824, '', {
      fontSize: '13px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(10);

    // Path toggle
    this.pathVisible = true;
    this.add.text(470, 62, '🗺️', { fontSize: '18px' })
      .setOrigin(1, 0).setDepth(10).setInteractive()
      .on('pointerdown', () => {
        this.pathVisible = !this.pathVisible;
        if (this.pathGraphics) this.pathGraphics.setVisible(this.pathVisible);
      });
  }

  setupInput() {
    let startX = 0, startY = 0;
    const THRESHOLD = 24;

    this.input.on('pointerdown', (p) => {
      if (this.gameOver) return;
      startX = p.x; startY = p.y;
    });

    this.input.on('pointermove', (p) => {
      if (this.gameOver || !p.isDown || this.isMoving) return;
      const dx = p.x - startX, dy = p.y - startY;
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;

      const dc = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : -1) : 0;
      const dr = Math.abs(dx) > Math.abs(dy) ? 0 : (dy > 0 ? 1 : -1);
      const next = { col: this.monsterCell.col + dc, row: this.monsterCell.row + dr };

      if (next.col < 0 || next.col >= this.cols || next.row < 0 || next.row >= this.rows) return;

      startX = p.x; startY = p.y;
      this.isMoving = true;
      this.moveMonster(next, () => { this.isMoving = false; });
    });
  }

  moveMonster(targetCell, onComplete) {
    this.monsterCell = targetCell;
    const pos = this.cellToPixel(targetCell);
    this.tweens.add({
      targets: [this.monsterSprite, this.monsterGlow],
      x: pos.x, y: pos.y,
      duration: this.monsterSpeed,
      ease: 'Power2',
      onComplete: () => {
        this.checkCollisions();
        this.updatePath();
        if (onComplete) onComplete();
      }
    });
  }

  unlockBase() {
    this.baseUnlocked = true;
    this.baseSprLocked.setVisible(false);
    this.baseSprUnlocked.setVisible(true);

    this.tweens.add({
      targets: this.baseSprUnlocked,
      scaleX: 1.3, scaleY: 1.3,
      duration: 300, yoyo: true, ease: 'Power2'
    });

    this.cameras.main.flash(400, 255, 221, 0, false);
    this.showMsg('🔓 BASE UNLOCKED! Reach it!', '#ffdd00', 2500);
    this.updatePath();
  }

  evolve(towerType) {
    const defs = {
      fire:   { label: '🔥 +Speed', color: 0xff6600, apply: () => {
        this.monsterSpeed = Math.max(60, this.monsterSpeed - 20);
        this.speedText.setText('💨 ' + (150/this.monsterSpeed).toFixed(1) + 'x');
      }},
      ice:    { label: '❄️ +Armor', color: 0x66ccff, apply: () => {
        this.monsterArmor = Math.min(80, this.monsterArmor + 20);
        this.armorText.setText('🛡️ ' + this.monsterArmor + '%');
      }},
      arcane: { label: '✨ +Power', color: 0xcc66ff, apply: () => {
        this.monsterPower += 2;
        this.monsterMaxHP += 20;
        this.monsterHP = Math.min(this.monsterMaxHP, this.monsterHP + 20);
        this.powerText.setText('⚔️ ' + this.monsterPower);
      }},
    };

    const evo = defs[towerType];
    if (!evo) return;
    evo.apply();
    this.evolutions.push(towerType);
    this.towersEaten++;

    this.eatCounter.setText(`🍴 ${this.towersEaten}/${this.level.required}`)
      .setColor(this.towersEaten >= this.level.required ? '#ffdd00' : '#ffffff');

    if (this.towersEaten >= this.level.required && !this.baseUnlocked) {
      this.time.delayedCall(300, () => this.unlockBase());
    }

    // Tint monster
    this.monsterSprite.setTint(evo.color);
    this.monsterGlow.setFillStyle(evo.color);
    this.showMsg(evo.label, '#ffffff', 1500);

    this.tweens.add({
      targets: this.monsterSprite,
      scaleX: 1.4, scaleY: 1.4,
      duration: 200, yoyo: true, ease: 'Power2'
    });
  }

    towerShoot() {
    if (this.gameOver) return;
    this.towers.forEach(tower => {
        const from   = this.cellToPixel(tower.cell);
        const targetX = this.monsterSprite.x;  // πάρε τη θέση ΤΩΡΑ
        const targetY = this.monsterSprite.y;
        const bullet = this.add.image(from.x, from.y, `bullet_${tower.type}`).setDepth(6);
        this.tweens.add({
        targets: bullet,
        x: targetX,
        y: targetY,
        duration: 500,
        ease: 'Linear',
        onComplete: () => {
            bullet.destroy();
            // Έλεγξε αν το monster είναι κοντά στο σημείο πρόσκρουσης
            const dx = this.monsterSprite.x - targetX;
            const dy = this.monsterSprite.y - targetY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.tileSize) {  // μέσα σε 1 tile = πέτυχε
            this.takeDamage(Math.floor(10 * (1 - this.monsterArmor / 100)));
            }
        }
        });
    });
    }

  takeDamage(amount) {
    if (this.gameOver) return;
    this.monsterHP = Math.max(0, this.monsterHP - amount);
    const ratio = this.monsterHP / this.monsterMaxHP;
    this.hpBarFill.setScale(ratio, 1);
    this.hpBarFill.setFillStyle(ratio > 0.5 ? 0x00ff88 : ratio > 0.25 ? 0xffaa00 : 0xff4444);
    this.hpText.setText('HP ' + this.monsterHP);
    this.monsterSprite.setTint(0xffffff);
    this.time.delayedCall(120, () => {
      if (!this.gameOver) this.monsterSprite.clearTint();
    });
    if (this.monsterHP <= 0) this.endGame(false);
  }

  checkCollisions() {
    if (this.gameOver) return;

    if (this.baseUnlocked &&
        this.monsterCell.col === this.baseCell.col &&
        this.monsterCell.row === this.baseCell.row) {
      this.endGame(true);
      return;
    }

    for (let i = this.towers.length - 1; i >= 0; i--) {
      const t = this.towers[i];
      if (t.cell.col === this.monsterCell.col && t.cell.row === this.monsterCell.row) {
        t.hp -= this.monsterPower;
        const ratio = Math.max(0, t.hp / t.maxHp);
        t.hpBar.setScale(ratio, 1);
        t.hpBar.setFillStyle(ratio > 0.5 ? 0x00ff00 : 0xff4400);
        if (t.hp <= 0) {
          t.sprite.destroy(); t.hpBar.destroy(); t.hpBarBg.destroy();
          this.evolve(t.type);
          this.towers.splice(i, 1);
          this.cameras.main.shake(200, 0.01);
        }
        break;
      }
    }
  }

  updatePath() {
    if (!this.pathGraphics) this.pathGraphics = this.add.graphics().setDepth(1);
    this.pathGraphics.clear();

    const goal    = this.baseUnlocked ? this.baseCell : this.findNearestTower();
    if (!goal) return;

    const blocked = this.towers
      .filter(t => !(t.cell.col === goal.col && t.cell.row === goal.row))
      .map(t => t.cell);

    const path = PathFinder.findPath(this.monsterCell, goal, this.cols, this.rows, blocked);
    if (!path.length) {
      this.pathGraphics.fillStyle(0xff0000, 0.2);
      const mp = this.cellToPixel(this.monsterCell);
      this.pathGraphics.fillCircle(mp.x, mp.y, 28);
      return;
    }

    const accentColor = parseInt(this.theme.accent.replace('#',''), 16);
    path.forEach((cell, i) => {
      const alpha = 0.25 - (i / path.length) * 0.15;
      this.pathGraphics.fillStyle(accentColor, alpha);
      this.pathGraphics.fillRect(
        this.offsetX + cell.col * this.tileSize + 5,
        this.offsetY + cell.row * this.tileSize + 5,
        this.tileSize - 10, this.tileSize - 10
      );
    });

    const next = path[0];
    const pos  = this.cellToPixel(next);
    this.pathGraphics.fillStyle(accentColor, 0.6);
    this.pathGraphics.fillCircle(pos.x, pos.y, 7);
    this.pathGraphics.setVisible(this.pathVisible);
  }

  findNearestTower() {
    if (!this.towers.length) return null;
    return this.towers.reduce((best, t) => {
      const d = Math.abs(t.cell.col - this.monsterCell.col) + Math.abs(t.cell.row - this.monsterCell.row);
      const bd = Math.abs(best.col - this.monsterCell.col) + Math.abs(best.row - this.monsterCell.row);
      return d < bd ? t.cell : best;
    }, this.towers[0].cell);
  }

  showMsg(text, color, duration) {
    this.msgText.setText(text).setColor(color);
    this.time.delayedCall(duration, () => this.msgText.setText(''));
  }

  endGame(win) {
    this.gameOver = true;
    this.isMoving = false;
    this.input.off('pointerdown');
    this.input.off('pointermove');
    this.scene.start('LevelScene', {
      level: this.level,
      win,
      stats: {
        hp: this.monsterHP, maxHp: this.monsterMaxHP,
        eaten: this.towersEaten, power: this.monsterPower,
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