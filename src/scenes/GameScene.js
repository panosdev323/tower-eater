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
    this.level     = LEVELS[this.levelIndex];
    this.world     = this.level.world;
    this.theme     = SpriteFactory.getWorldTheme(this.world);
    this.mechanics = this.level.mechanics ?? {};
    this.hasMovedOnce = false;

    this.invincible = false;
    this.tileSize   = 48;
    this.cols       = 10;
    this.rows       = 16;
    this.offsetX    = (480 - this.cols * this.tileSize) / 2;
    this.offsetY    = (854 - this.rows * this.tileSize) / 2;

    this.monsterHP    = 100;
    this.monsterMaxHP = 100;
    this.monsterPower = 1;
    this.monsterArmor = 0;
    this.monsterSpeed = 150;
    this.evolutions   = [];
    this.towersEaten  = 0;
    this.baseUnlocked = false;
    this.isMoving     = false;
    this.gameOver     = false;

    // volcanic: grenade shot counter
    this._shotCounter = 0;

    // Background
    this.add.rectangle(240, 427, 480, 854, parseInt(this.theme.bg.replace('#',''), 16));

    this.drawGrid();
    this.createBase();
    this.createTowers();
    this.createMonster();
    this.createUI();
    this.setupInput();
    this.updatePath();

    // ── Settings button ──────────────────────────────────
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        // Αφαίρεσε παλιό listener αν υπάρχει
        settingsBtn.onclick = null;
        settingsBtn.onclick = () => this._openPause();
    }

    // ── Pause / Resume events ────────────────────────────
    this._pauseHandler  = () => this.scene.pause();
    this._resumeHandler = () => this.scene.resume();
    window.addEventListener('pauseGame',  this._pauseHandler);
    window.addEventListener('resumeGame', this._resumeHandler);

    // ── GET READY overlay ────────────────────────────────
    this._showGetReady();

    // ── Main shoot loop ──────────────────────────────────────────────
    this.time.addEvent({
      delay: this.level.shootDelay,
      callback: this.towerShoot,
      callbackScope: this,
      loop: true
    });

    // ── Void: moving towers ──────────────────────────────────────────
    if (this.mechanics.towerMoveDelay) {
      this.time.addEvent({
        delay: this.mechanics.towerMoveDelay,
        callback: this.moveTowersRandomly,
        callbackScope: this,
        loop: true
      });
    }
  }

  // ── Grid / Sprites ──────────────────────────────────────────────────

  drawGrid() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetX + c * this.tileSize;
        const y = this.offsetY + r * this.tileSize;
        this.add.image(x + 24, y + 24, `terrain_${this.world}`).setDepth(0);
      }
    }
  }

  createMonster() {
    this.monsterCell   = { col: 1, row: 13 };
    const pos          = this.cellToPixel(this.monsterCell);
    this.monsterSprite = this.add.image(pos.x, pos.y, 'monster').setDepth(5);
    this.monsterGlow   = this.add.circle(pos.x, pos.y, 26, 0x00ff88, 0.15).setDepth(4);
  }

  createTowers() {
    this.towers = [];
    this.level.towers.forEach(td => {
      const pos        = this.cellToPixel(td);
      const textureKey = `tower_${td.type}_${this.world}`;
      const sprite     = this.add.image(pos.x, pos.y, textureKey).setDepth(3);
      const hpBarBg    = this.add.rectangle(pos.x, pos.y - 28, 36, 5, 0x333333).setDepth(4);
      const hpBar      = this.add.rectangle(pos.x - 18, pos.y - 28, 36, 5, 0x00ff00).setDepth(5).setOrigin(0, 0.5);
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
    const pos     = this.cellToPixel(this.baseCell);

    this.baseSprLocked   = this.add.image(pos.x, pos.y, 'base_locked').setDepth(3);
    this.baseSprUnlocked = this.add.image(pos.x, pos.y, `base_${this.world}`).setDepth(3).setVisible(false);
  }

  // ── UI ──────────────────────────────────────────────────────────────

  createUI() {
    const worldIcons = { dungeon:'⚔️', forest:'🌿', volcanic:'🌋', frozen:'❄️', void:'💀' };
    this.add.text(10, 6, `${worldIcons[this.world]} ${this.level.name}`, {
      fontSize: '13px', color: '#aaaaaa'
    }).setDepth(10);

    this.add.text(470, 6, `Lv.${this.level.id}`, {
      fontSize: '13px', color: '#666666'
    }).setOrigin(1, 0).setDepth(10);

    // Mechanic badge (forest / volcanic / void)
    const badgeText = this.world === 'forest'   ? '⚡ Fast Bullets'
                    : this.world === 'volcanic'  ? '💣 Grenades'
                    : this.world === 'void'      ? '👁 Moving Towers'
                    : '';
    if (badgeText) {
      this.add.text(240, 6, badgeText, {
        fontSize: '11px', color: '#ff9900'
      }).setOrigin(0.5, 0).setDepth(10);
    }

    // HP bar
    this.add.rectangle(240, 24, 302, 14, 0x222222).setDepth(10);
    this.hpBarFill = this.add.rectangle(90, 24, 300, 12, 0x00ff88).setDepth(11).setOrigin(0, 0.5);
    this.hpText    = this.add.text(240, 24, 'HP 100', { fontSize: '10px', color: '#000' }).setOrigin(0.5).setDepth(12);

    this.powerText = this.add.text(10,  42, '⚔️ 1',   { fontSize: '13px', color: '#ffaa00' }).setDepth(10);
    this.armorText = this.add.text(70,  42, '🛡️ 0%', { fontSize: '13px', color: '#44aaff' }).setDepth(10);
    this.speedText = this.add.text(140, 42, '💨 1x',  { fontSize: '13px', color: '#aaffaa' }).setDepth(10);

    this.eatCounter = this.add.text(470, 42, `🍴 0/${this.level.required}`, {
      fontSize: '16px', color: '#ffffff'
    }).setOrigin(1, 0).setDepth(10);

    this.msgText = this.add.text(240, 824, '', {
      fontSize: '13px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(10);

    this.pathVisible = true;
    this.add.text(470, 62, '🗺️', { fontSize: '18px' })
      .setOrigin(1, 0).setDepth(10).setInteractive()
      .on('pointerdown', () => {
        this.pathVisible = !this.pathVisible;
        if (this.pathGraphics) this.pathGraphics.setVisible(this.pathVisible);
      });
  }

  // ── Input ───────────────────────────────────────────────────────────

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

  // ── Movement ────────────────────────────────────────────────────────

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

  // ── VOID: Moving towers ──────────────────────────────────────────────
  moveTowersRandomly() {
    if (this.gameOver) return;

    const dirs = [{dc:0,dr:-1},{dc:0,dr:1},{dc:-1,dr:0},{dc:1,dr:0}];

    this.towers.forEach(tower => {
      // Pulse warning before moving
      this.tweens.add({
        targets: tower.sprite,
        scaleX: 1.3, scaleY: 1.3,
        duration: 200, yoyo: true, ease: 'Power2'
      });

      this.time.delayedCall(300, () => {
        if (this.gameOver) return;

        // Shuffle directions for randomness
        const shuffled = Phaser.Utils.Array.Shuffle([...dirs]);

        for (const dir of shuffled) {
          const nc = tower.cell.col + dir.dc;
          const nr = tower.cell.row + dir.dr;

          // Bounds check
          if (nc < 0 || nc >= this.cols || nr < 0 || nr >= this.rows) continue;

          // Collision check: no other tower, not the base, not the monster
          const occupied =
            this.towers.some(t => t !== tower && t.cell.col === nc && t.cell.row === nr) ||
            (nc === this.baseCell.col && nr === this.baseCell.row) ||
            (nc === this.monsterCell.col && nr === this.monsterCell.row);

          if (occupied) continue;

          // Move!
          tower.cell = { col: nc, row: nr };
          const newPos = this.cellToPixel(tower.cell);

          this.tweens.add({
            targets: [tower.sprite, tower.hpBarBg, tower.hpBar],
            x: newPos.x,
            duration: 400,
            ease: 'Power2'
          });
          // HP bar Y offset
          this.tweens.add({
            targets: [tower.hpBarBg, tower.hpBar],
            y: newPos.y - 28,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
              // Re-anchor hpBar origin x after move
              tower.hpBar.x = newPos.x - 18;
            }
          });
          this.tweens.add({
            targets: tower.sprite,
            y: newPos.y,
            duration: 400,
            ease: 'Power2',
            onComplete: () => this.updatePath()
          });

          break; // one move per tower per tick
        }
      });
    });
  }

  // ── Base unlock ──────────────────────────────────────────────────────

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

  // ── Evolution ────────────────────────────────────────────────────────

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

    this.monsterSprite.setTint(evo.color);
    this.monsterGlow.setFillStyle(evo.color);
    this.showMsg(evo.label, '#ffffff', 1500);

    this.tweens.add({
      targets: this.monsterSprite,
      scaleX: 1.4, scaleY: 1.4,
      duration: 200, yoyo: true, ease: 'Power2'
    });
  }

  // ── Shooting ─────────────────────────────────────────────────────────

  towerShoot() {
    if (this.gameOver) return;

    this._shotCounter++;
    const isGrenade = this.mechanics.grenadePeriod &&
                      (this._shotCounter % this.mechanics.grenadePeriod === 0);

    // Travel time: forest speeds up bullets, default 500ms
    const duration = this.mechanics.bulletDuration ?? 500;

    this.towers.forEach(tower => {
      const from    = this.cellToPixel(tower.cell);
      const targetX = this.monsterSprite.x;
      const targetY = this.monsterSprite.y;

      if (isGrenade) {
        this._fireGrenade(from, targetX, targetY);
      } else {
        this._fireBullet(tower, from, targetX, targetY, duration);
      }
    });
  }

  _fireBullet(tower, from, targetX, targetY, duration) {
    const bullet = this.add.image(from.x, from.y, `bullet_${tower.type}`).setDepth(6);
    this.tweens.add({
      targets: bullet,
      x: targetX, y: targetY,
      duration,
      ease: 'Linear',
      onComplete: () => {
        bullet.destroy();
        const dx   = this.monsterSprite.x - targetX;
        const dy   = this.monsterSprite.y - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.tileSize) {
          this.takeDamage(Math.floor(10 * (1 - this.monsterArmor / 100)));
        }
      }
    });
  }

  _fireGrenade(from, targetX, targetY) {
    // Visual: bigger, orange-ish circle projectile
    const grenade = this.add.circle(from.x, from.y, 10, 0xff6600).setDepth(6);
    // Arc: go up first then come down
    const midX = (from.x + targetX) / 2;
    const midY = Math.min(from.y, targetY) - 80;

    this.tweens.add({
      targets: grenade,
      x: { value: targetX, ease: 'Linear' },
      y: { value: targetY, ease: 'Quad.easeIn' },
      duration: 700,
      onComplete: () => {
        grenade.destroy();
        this._grenadeExplode(targetX, targetY);
      }
    });
  }

  _grenadeExplode(cx, cy) {
    // Visual explosion
    const boom = this.add.circle(cx, cy, 10, 0xff9900, 0.9).setDepth(7);
    this.tweens.add({
      targets: boom,
      scaleX: 4, scaleY: 4,
      alpha: 0,
      duration: 350,
      ease: 'Power2',
      onComplete: () => boom.destroy()
    });

    // AoE damage: check if monster is within 1.5 tiles
    const dx   = this.monsterSprite.x - cx;
    const dy   = this.monsterSprite.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.tileSize * 1.5) {
      // Double damage, ignores half of armor
      const effectiveArmor = this.monsterArmor / 2;
      this.takeDamage(Math.floor(20 * (1 - effectiveArmor / 100)));
      this.cameras.main.shake(150, 0.015);
    }
  }

  // ── Damage / Death ────────────────────────────────────────────────────

  takeDamage(amount) {
    if (this.gameOver || this.invincible) return;

    this.invincible = true;
    this.monsterHP  = Math.max(0, this.monsterHP - amount);
    const ratio     = this.monsterHP / this.monsterMaxHP;
    this.hpBarFill.setScale(ratio, 1);
    this.hpBarFill.setFillStyle(ratio > 0.5 ? 0x00ff88 : ratio > 0.25 ? 0xffaa00 : 0xff4444);
    this.hpText.setText('HP ' + this.monsterHP);

    this.monsterSprite.setTint(0xff0000);
    this.cameras.main.flash(80, 255, 0, 0, false);

    const origX = this.hpBarFill.x;
    this.tweens.add({
      targets: this.hpBarFill,
      x: origX + 4,
      duration: 40, yoyo: true, repeat: 3, ease: 'Linear',
      onComplete: () => this.hpBarFill.x = origX
    });

    this.time.delayedCall(120, () => {
      if (!this.gameOver) this.monsterSprite.clearTint();
    });

    this.time.delayedCall(500, () => { this.invincible = false; });

    if (this.monsterHP <= 0) this.deathAnimation();
  }

  deathAnimation() {
    this.gameOver  = true;
    this.isMoving  = false;
    this.input.off('pointerdown');
    this.input.off('pointermove');

    this.cameras.main.flash(300, 255, 0, 0, false);
    this.cameras.main.shake(400, 0.02);

    const cx = this.monsterSprite.x;
    const cy = this.monsterSprite.y;
    [0, 60, 120, 180, 240, 300].forEach(deg => {
      const rad   = (deg * Math.PI) / 180;
      const piece = this.add.circle(cx, cy, 6, 0x00ff88).setDepth(10);
      this.tweens.add({
        targets: piece,
        x: cx + Math.cos(rad) * 60,
        y: cy + Math.sin(rad) * 60,
        scaleX: 0, scaleY: 0, alpha: 0,
        duration: 600, ease: 'Power2'
      });
    });

    this.tweens.add({
      targets: [this.monsterSprite, this.monsterGlow],
      scaleX: 2, scaleY: 2, alpha: 0,
      duration: 400, ease: 'Power2'
    });

    this.time.delayedCall(800, () => {
      this.scene.start('LevelScene', {
        level: this.level, win: false,
        stats: {
          hp: this.monsterHP, maxHp: this.monsterMaxHP,
          eaten: this.towersEaten, power: this.monsterPower,
          evolutions: this.evolutions
        }
      });
    });
  }

  // ── Collisions ────────────────────────────────────────────────────────

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
          const tx = t.sprite.x, ty = t.sprite.y;
          t.sprite.destroy(); t.hpBar.destroy(); t.hpBarBg.destroy();
          [...Array(8)].forEach((_, i) => {
            const rad   = (i / 8) * Math.PI * 2;
            const color = t.type === 'fire' ? 0xff6600 : t.type === 'ice' ? 0x44aaff : 0xaa44ff;
            const p     = this.add.circle(tx, ty, 4, color).setDepth(10);
            this.tweens.add({
              targets: p,
              x: tx + Math.cos(rad) * 40,
              y: ty + Math.sin(rad) * 40,
              scaleX: 0, scaleY: 0, alpha: 0,
              duration: 400, ease: 'Power2',
              onComplete: () => p.destroy()
            });
          });
          this.evolve(t.type);
          this.towers.splice(i, 1);
          this.cameras.main.shake(200, 0.01);
        }
        break;
      }
    }
  }

  // ── Path ──────────────────────────────────────────────────────────────

  updatePath() {
    if (!this.pathGraphics) this.pathGraphics = this.add.graphics().setDepth(1);
    this.pathGraphics.clear();
    if (this.pathBlinkTimer) { this.pathBlinkTimer.remove(); this.pathBlinkTimer = null; }

    const goal = this.baseUnlocked ? this.baseCell : this.findNearestTower();
    if (!goal) return;

    const blocked = this.towers
      .filter(t => !(t.cell.col === goal.col && t.cell.row === goal.row))
      .map(t => t.cell);

    const path = PathFinder.findPath(this.monsterCell, goal, this.cols, this.rows, blocked);
    if (!path.length) {
      let visible = true;
      this.pathBlinkTimer = this.time.addEvent({
        delay: 300, loop: true,
        callback: () => {
          this.pathGraphics.clear();
          if (visible) {
            this.pathGraphics.fillStyle(0xff0000, 0.4);
            const mp = this.cellToPixel(this.monsterCell);
            this.pathGraphics.fillCircle(mp.x, mp.y, 28);
          }
          visible = !visible;
        }
      });
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
      const d  = Math.abs(t.cell.col - this.monsterCell.col) + Math.abs(t.cell.row - this.monsterCell.row);
      const bd = Math.abs(best.col - this.monsterCell.col) + Math.abs(best.row - this.monsterCell.row);
      return d < bd ? t.cell : best;
    }, this.towers[0].cell);
  }

  // ── Helpers ───────────────────────────────────────────────────────────

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
      level: this.level, win,
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

    _showGetReady() {
    const overlay = this.add.rectangle(240, 427, 480, 854, 0x000000, 0.6).setDepth(50);
    const txt = this.add.text(240, 400, 'GET READY', {
        fontSize: '36px', color: '#ffffff', fontStyle: 'bold',
        stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(51);

    const sub = this.add.text(240, 450, 'Swipe to move', {
        fontSize: '18px', color: '#aaaaaa'
    }).setOrigin(0.5).setDepth(51);

    // Countdown 3..2..1..GO
    let count = 3;
    const countdown = this.add.text(240, 520, count.toString(), {
        fontSize: '60px', color: '#ffdd00', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(51);

    const timer = this.time.addEvent({
        delay: 800,
        repeat: 3,
        callback: () => {
        count--;
        if (count > 0) {
            countdown.setText(count.toString());
            this.tweens.add({
            targets: countdown,
            scaleX: 1.4, scaleY: 1.4,
            duration: 200, yoyo: true
            });
        } else {
            countdown.setText('GO!').setColor('#00ff88');
            this.tweens.add({
            targets: [overlay, txt, sub, countdown],
            alpha: 0, duration: 400,
            onComplete: () => {
                overlay.destroy(); txt.destroy();
                sub.destroy(); countdown.destroy();
                // ← Shoot timer ξεκινάει ΜΕΤΑ το countdown
                this._startShootTimer();
            }
            });
        }
        }
    });

    // Block input κατά τη διάρκεια
    this.isMoving = true;
    this.time.delayedCall(800 * 4, () => { this.isMoving = false; });
    }

    _startShootTimer() {
    if (this.shootTimer) this.shootTimer.remove();
    this.shootTimer = this.time.addEvent({
        delay: this.level.shootDelay,
        callback: this.towerShoot,
        callbackScope: this,
        loop: true
    });
    }

    _openPause() {
    if (!this.pauseMenu) {
        const { PauseMenu } = window.__PauseMenuClass__;
        this.pauseMenu = new PauseMenu(
        () => {},                    // onResume — το handle το κάνει το event
        () => {                      // onRestart
            this.pauseMenu.destroy();
            this.pauseMenu = null;
            this._cleanupListeners();
            this.scene.start('GameScene', { levelIndex: 0 });
        },
        (musicOn) => {               // onMusicToggle
            // music logic αργότερα
            console.log('Music:', musicOn);
        }
        );
    }
    this.pauseMenu.show();
    }

    _cleanupListeners() {
    window.removeEventListener('pauseGame',  this._pauseHandler);
    window.removeEventListener('resumeGame', this._resumeHandler);
    const btn = document.getElementById('settings-btn');
    if (btn) btn.onclick = null;
    }
}