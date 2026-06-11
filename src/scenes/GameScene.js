import { AdManager } from '../systems/AdManager.js';
import { PathFinder } from '../systems/PathFinder.js';
import { LEVELS } from '../data/levels.js';
import { SpriteFactory } from '../systems/SpriteFactory.js';
import { soundManager } from '../systems/SoundManager.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { ContinueScreen } from '../ui/ContinueScreen.js';

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

    this.invincible = false;
    this.frozen     = false;
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

    this._shotCounter = 0;

    this.add.rectangle(240, 427, 480, 854, parseInt(this.theme.bg.replace('#',''), 16));

    this.drawGrid();
    this.createBase();
    this.createTowers();
    this.createMonster();
    this.createUI();
    this.setupInput();
    this.updatePath();

    ProgressManager.saveLevel(this.levelIndex);
    ProgressManager.updateBest(this.levelIndex);

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.onclick = null;
      settingsBtn.onclick = () => this._openPause();
    }

    // Guard: only pause/resume if GameScene is the active, running scene
    this._pauseHandler = () => {
      if (!this.scene.isPaused('GameScene')) {
        this.scene.pause('GameScene');
      }
    };
    this._resumeHandler = () => {
      if (this.scene.isPaused('GameScene')) {
        this.scene.resume('GameScene');
      }
    };

    // Αποθήκευσε globally για cleanup από άλλα scenes
    window.__lastPauseHandler__  = this._pauseHandler;
    window.__lastResumeHandler__ = this._resumeHandler;

    window.addEventListener('pauseGame',  this._pauseHandler);
    window.addEventListener('resumeGame', this._resumeHandler);

    if (this.mechanics.towerMoveDelay) {
      this.time.addEvent({
        delay: this.mechanics.towerMoveDelay,
        callback: this.moveTowersRandomly,
        callbackScope: this,
        loop: true
      });
    }

    if (AdManager.isShowing) {
      window.__onAdClosed__ = () => this._showGetReady();
    } else {
      this._showGetReady();
    }
  }

  // ── Grid / Sprites ────────────────────────────────────────────────────

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
    this.monsterSprite = this.add.image(pos.x, pos.y, 'monster').setDepth(5).setScale(1.3);
    this.monsterGlow   = this.add.circle(pos.x, pos.y, 30, 0x00ff88, 0.18).setDepth(4);
    this.tweens.add({
      targets: this.monsterSprite,
      scaleY: 0.85,
      duration: 350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
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

  // ── UI ────────────────────────────────────────────────────────────────

  createUI() {
    const worldIcons = { dungeon:'⚔️', forest:'🌿', volcanic:'🌋', frozen:'❄️', void:'💀' };
    this.add.text(10, 6, `${worldIcons[this.world]} ${this.level.name}`, {
      fontSize: '13px', color: '#aaaaaa'
    }).setDepth(10);

    this.add.text(470, 6, `Lv.${this.level.id}`, {
      fontSize: '13px', color: '#666666'
    }).setOrigin(1, 0).setDepth(10);

    const badgeText = this.world === 'forest'   ? '⚡ Fast Bullets'
                    : this.world === 'volcanic'  ? '💣 Grenades'
                    : this.world === 'void'      ? '👁 Moving Towers'
                    : this.world === 'frozen'    ? '❄️ Freeze'
                    : '';
    if (badgeText) {
      this.add.text(240, 6, badgeText, {
        fontSize: '11px', color: '#ff9900'
      }).setOrigin(0.5, 0).setDepth(10);
    }

    this.add.rectangle(240, 34, 302, 14, 0x222222).setDepth(10);
    this.hpBarFill = this.add.rectangle(90, 34, 300, 12, 0x00ff88).setDepth(11).setOrigin(0, 0.5);
    this.hpText    = this.add.text(240, 34, 'HP 100', { fontSize: '10px', color: '#000' }).setOrigin(0.5).setDepth(12);

    this.eatCounter = this.add.text(240, 42, `🏰 Eat ${this.level.required} more!`, {
      fontSize: '16px', color: '#ffffff'
    }).setOrigin(0.5, 0).setDepth(10);

    this.msgText = this.add.text(240, 824, '', {
      fontSize: '13px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(10);

    this.pathVisible = true;
  }

  // ── Input ─────────────────────────────────────────────────────────────

  setupInput() {
    let startX = 0, startY = 0;
    const THRESHOLD = 24;

    this.input.on('pointerdown', (p) => {
      if (this.gameOver) return;
      startX = p.x; startY = p.y;
    });

    this.input.on('pointermove', (p) => {
      // Block if frozen, not started, already mid-move, or game over
      if (this.gameOver || !p.isDown || this.isMoving || this.frozen) return;
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

  // ── Movement ──────────────────────────────────────────────────────────

  moveMonster(targetCell, onComplete) {
    soundManager.move();
    this.monsterCell = targetCell;
    const pos = this.cellToPixel(targetCell);

    // Keep freeze overlay on top of monster while moving
    if (this._freezeOverlay) {
      this.tweens.add({
        targets: this._freezeOverlay,
        x: pos.x, y: pos.y,
        duration: this.monsterSpeed,
        ease: 'Power2'
      });
    }

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

  // ── VOID: Moving towers ───────────────────────────────────────────────

  moveTowersRandomly() {
    if (this.gameOver) return;
    const dirs = [{dc:0,dr:-1},{dc:0,dr:1},{dc:-1,dr:0},{dc:1,dr:0}];

    this.towers.forEach(tower => {
      this.tweens.add({
        targets: tower.sprite,
        scaleX: 1.3, scaleY: 1.3,
        duration: 200, yoyo: true, ease: 'Power2'
      });

      this.time.delayedCall(300, () => {
        if (this.gameOver) return;
        const shuffled = Phaser.Utils.Array.Shuffle([...dirs]);

        for (const dir of shuffled) {
          const nc = tower.cell.col + dir.dc;
          const nr = tower.cell.row + dir.dr;
          if (nc < 0 || nc >= this.cols || nr < 0 || nr >= this.rows) continue;

          const occupied =
            this.towers.some(t => t !== tower && t.cell.col === nc && t.cell.row === nr) ||
            (nc === this.baseCell.col && nr === this.baseCell.row) ||
            (nc === this.monsterCell.col && nr === this.monsterCell.row);
          if (occupied) continue;

          tower.cell = { col: nc, row: nr };
          const newPos = this.cellToPixel(tower.cell);

          this.tweens.add({
            targets: [tower.sprite, tower.hpBarBg, tower.hpBar],
            x: newPos.x, y: newPos.y,
            duration: 400, ease: 'Power2',
            onComplete: () => {
              tower.hpBar.x   = newPos.x - 18;
              tower.hpBarBg.y = newPos.y - 28;
              tower.hpBar.y   = newPos.y - 28;
              this.updatePath();
            }
          });
          break;
        }
      });
    });
  }

  // ── Base unlock ───────────────────────────────────────────────────────

  unlockBase() {
    soundManager.unlockBase();
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

  // ── Evolution ─────────────────────────────────────────────────────────

  evolve(towerType) {
    const defs = {
      fire:   { msg: '💨 Faster!',      color: 0xff6600, apply: () => {
        this.monsterSpeed = Math.max(50, this.monsterSpeed - 25);
      }},
      ice:    { msg: '🛡️ More armor!', color: 0x66ccff, apply: () => {
        this.monsterArmor = Math.min(80, this.monsterArmor + 20);
      }},
      arcane: { msg: '⚔️ More power!',  color: 0xcc66ff, apply: () => {
        this.monsterPower += 2;
        this.monsterMaxHP += 20;
        this.monsterHP = Math.min(this.monsterMaxHP, this.monsterHP + 20);
      }},
    };

    const evo = defs[towerType];
    if (!evo) return;
    evo.apply();

    this.evolutions.push(towerType);
    this.towersEaten++;

    const remaining = Math.max(0, this.level.required - this.towersEaten);
    this.eatCounter
      .setText(remaining > 0 ? `🏰 Eat ${remaining} more!` : '🔓 Find the base!')
      .setColor(remaining > 0 ? '#ffffff' : '#ffdd00');

    if (this.towersEaten >= this.level.required && !this.baseUnlocked) {
      this.time.delayedCall(300, () => this.unlockBase());
    }

    this.monsterSprite.setTint(evo.color);
    this.monsterGlow.setFillStyle(evo.color);
    this.showMsg(evo.msg, '#ffdd00', 1500);
    this.tweens.add({
      targets: this.monsterSprite,
      scaleX: 1.4, scaleY: 1.4,
      duration: 200, yoyo: true, ease: 'Power2'
    });
  }

  // ── Shooting ──────────────────────────────────────────────────────────

  // Στο _fireBullet — cap στο πόσοι πύργοι πυροβολούν ανά salvo
  towerShoot() {
    if (this.gameOver) return;
    if (!this.towers.length) return;
    soundManager.shoot();
    this._shotCounter++;
    const isGrenade = this.mechanics.grenadePeriod &&
                      (this._shotCounter % this.mechanics.grenadePeriod === 0);
    const duration  = this.mechanics.bulletDuration ?? 500;

    // Max 6 πύργοι ανά salvo σε high levels — τυχαία επιλογή
    const maxShooters = this.level.id >= 71 ? 5
                      : this.level.id >= 51 ? 7
                      : this.towers.length;
    const shooters = this.towers.length > maxShooters
      ? Phaser.Utils.Array.Shuffle([...this.towers]).slice(0, maxShooters)
      : this.towers;

    shooters.forEach((tower, idx) => {
      this.time.delayedCall(idx * 80, () => {
        if (this.gameOver) return;
        const from = this.cellToPixel(tower.cell);
        if (isGrenade) this._fireGrenade(from, this.monsterSprite.x, this.monsterSprite.y);
        else this._fireBullet(tower, from, this.monsterSprite.x, this.monsterSprite.y, duration);
      });
    });
  }

  // GameScene.js — _fireBullet: μόνο ένας ice πύργος ανά salvo μπορεί να κάνει freeze
  _fireBullet(tower, from, targetX, targetY, duration) {
    const spread = this.level.id < 20 ? 40 : this.level.id < 40 ? 25 : 10;
    const tx = targetX + (Math.random() - 0.5) * spread;
    const ty = targetY + (Math.random() - 0.5) * spread;

    const bullet = this.add.image(from.x, from.y, `bullet_${tower.type}`).setDepth(6);
    this.tweens.add({
      targets: bullet,
      x: tx, y: ty,
      duration, ease: 'Linear',
      onComplete: () => {
        bullet.destroy();
        const dx   = this.monsterSprite.x - tx;
        const dy   = this.monsterSprite.y - ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.tileSize * 1.1) {
          this.takeDamage(Math.floor(20 * (1 - this.monsterArmor / 100)));
          const canFreeze = this.mechanics.freezeDuration
          && tower.type === 'ice'
          && !this.frozen
          && (this.level.id < 50 || this._shotCounter % (this.mechanics.freezePeriod ?? 4) === 0);
          if (canFreeze) this._applyFreeze();
        }
      }
    });
  }

  _applyFreeze() {
    if (this.frozen || this.gameOver) return;
    soundManager.freeze();
    this.frozen   = true;
    this.isMoving = true; // block swipe while frozen

    this.monsterSprite.setTint(0x44aaff);
    this.monsterGlow.setFillStyle(0x44aaff);

    this._freezeOverlay = this.add.circle(
      this.monsterSprite.x, this.monsterSprite.y,
      28, 0x44aaff, 0.3
    ).setDepth(6);

    const FREEZE_MS = this.mechanics.freezeDuration ?? 4000;
    this.showMsg('❄️ FROZEN!', '#44aaff', FREEZE_MS);

    // Pulse once per second so player knows it's counting down
    let remaining = Math.round(FREEZE_MS / 1000);
    const pulseTick = () => {
      if (!this.frozen) return;
      remaining--;
      this.tweens.add({
        targets: this._freezeOverlay,
        scaleX: 1.4, scaleY: 1.4,
        duration: 150, yoyo: true, ease: 'Power2'
      });
      if (remaining > 0) this.time.delayedCall(1000, pulseTick);
    };
    this.time.delayedCall(1000, pulseTick);

    this.time.delayedCall(FREEZE_MS, () => this._thaw());
  }

  _thaw() {
    if (!this.frozen) return;
    this.frozen   = false;
    this.isMoving = false;
    this.monsterSprite.clearTint();
    this.monsterGlow.setFillStyle(0x00ff88);
    if (this._freezeOverlay) {
      this._freezeOverlay.destroy();
      this._freezeOverlay = null;
    }
  }

  _fireGrenade(from, targetX, targetY) {
    const grenade = this.add.circle(from.x, from.y, 10, 0xff6600).setDepth(6);
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
    soundManager.grenade();
    const boom = this.add.circle(cx, cy, 10, 0xff9900, 0.9).setDepth(7);
    this.tweens.add({
      targets: boom,
      scaleX: 4, scaleY: 4, alpha: 0,
      duration: 350, ease: 'Power2',
      onComplete: () => boom.destroy()
    });

    const dx   = this.monsterSprite.x - cx;
    const dy   = this.monsterSprite.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.tileSize * 1.5) {
      const effectiveArmor = this.monsterArmor / 2;
      this.takeDamage(Math.floor(40 * (1 - effectiveArmor / 100)));
      this.cameras.main.shake(150, 0.015);
    }
  }

  // ── Damage / Death ────────────────────────────────────────────────────

  takeDamage(amount) {
    if (this.gameOver || this.invincible) return;
    soundManager.hit();

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
      if (this.gameOver) return;
      this.monsterSprite.clearTint();
      // Επαναφορά glow στο χρώμα evolution αν υπάρχει
      const lastEvo = this.evolutions[this.evolutions.length - 1];
      if (lastEvo) {
        const evoColors = { fire: 0xff6600, ice: 0x66ccff, arcane: 0xcc66ff };
        this.monsterSprite.setTint(evoColors[lastEvo]);
        this.monsterGlow.setFillStyle(evoColors[lastEvo]);
      } else {
        this.monsterGlow.setFillStyle(0x00ff88);
      }
    });

    this.time.delayedCall(150, () => { this.invincible = false; });

    if (this.monsterHP <= 0) this.deathAnimation();
  }

  deathAnimation() {
    soundManager.death();
    this._thaw();
    this.gameOver = true;
    this.isMoving = false;
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

    // Μικρό delay πριν το continue screen
    this.time.delayedCall(900, () => {
      new ContinueScreen(
        // onContinue — ξαναρχίζει το ίδιο level με full HP
        () => {
          this._cleanupListeners();
          this.scene.start('GameScene', { levelIndex: this.levelIndex });
        },
        // onGiveUp — πάει στο LevelScene normally
        () => {
          this._cleanupListeners();
          this.scene.start('LevelScene', {
            level: this.level, win: false,
            stats: {
              hp: 0, maxHp: this.monsterMaxHP,
              eaten: this.towersEaten, power: this.monsterPower,
              evolutions: this.evolutions
            }
          });
        }
      );
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
          soundManager.eatTower();
          const tx = t.sprite.x, ty = t.sprite.y;
          const towerType = t.type;
          t.sprite.destroy(); t.hpBar.destroy(); t.hpBarBg.destroy();
          this._destroyTower(tx, ty, towerType);
          this.evolve(towerType);
          this.towers.splice(i, 1);
        }
        break;
      }
    }
  }

  _destroyTower(tx, ty, type) {
    const color = type === 'fire' ? 0xff6600
                : type === 'ice'  ? 0x44aaff
                : 0xaa44ff;

    [[-12,-10], [12,-10], [-12,10], [12,10]].forEach(([ox, oy]) => {
      const chunk = this.add.rectangle(tx + ox, ty + oy, 10, 10, color).setDepth(10);
      this.tweens.add({
        targets: chunk,
        x: tx + ox + (Math.random() - 0.5) * 60,
        y: ty + oy + 80 + Math.random() * 40,
        angle: (Math.random() - 0.5) * 180,
        scaleX: 0, scaleY: 0, alpha: 0,
        duration: 500 + Math.random() * 200,
        ease: 'Quad.easeIn',
        onComplete: () => chunk.destroy()
      });
    });

    const flash = this.add.circle(tx, ty, 24, color, 0.8).setDepth(9);
    this.tweens.add({
      targets: flash,
      scaleX: 2.5, scaleY: 2.5, alpha: 0,
      duration: 250, ease: 'Power2',
      onComplete: () => flash.destroy()
    });

    this.cameras.main.shake(180, 0.012);
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
    this._thaw();
    this.gameOver = true;
    this.isMoving = false;
    this.input.off('pointerdown');
    this.input.off('pointermove');
    if (win) soundManager.win();
    this._cleanupListeners();
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

  // ── Get Ready countdown ───────────────────────────────────────────────

  _showGetReady() {
    this.isMoving = true;

    const overlay = this.add.rectangle(240, 427, 480, 854, 0x000000, 0.85).setDepth(50);
    const txt = this.add.text(240, 340, 'GET READY', {
      fontSize: '36px', color: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(51);

    const sub = this.add.text(240, 390, 'Swipe to move', {
      fontSize: '18px', color: '#aaaaaa'
    }).setOrigin(0.5).setDepth(51);

    const startBtn = this.add.text(240, 500, '▶  TAP TO START', {
      fontSize: '22px', color: '#000000',
      backgroundColor: '#00ff88',
      padding: { x: 28, y: 14 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(51).setInteractive();

    this.tweens.add({
      targets: startBtn,
      scaleX: 1.06, scaleY: 1.06,
      duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    const mapBtn = this.add.text(240, 560, '🗺️  Map: ON', {
      fontSize: '16px', color: '#aaaaaa',
      backgroundColor: '#1a1a1a',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setDepth(51).setInteractive();

    mapBtn.on('pointerdown', () => {
      this.pathVisible = !this.pathVisible;
      if (this.pathGraphics) this.pathGraphics.setVisible(this.pathVisible);
      mapBtn.setText(this.pathVisible ? '🗺️  Map: ON' : '🗺️  Map: OFF');
      mapBtn.setColor(this.pathVisible ? '#aaaaaa' : '#444444');
    });

    const settingsHint = this.add.text(240, 600, '⚙️ Settings', {
      fontSize: '16px', color: '#888888',
      backgroundColor: '#1a1a1a',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setDepth(51).setInteractive();
    settingsHint.on('pointerdown', () => this._openPause());

    startBtn.on('pointerdown', () => {
      startBtn.disableInteractive();
      this.tweens.add({
        targets: [overlay, txt, sub, startBtn, mapBtn, settingsHint],
        alpha: 0, duration: 300,
        onComplete: () => {
          [overlay, txt, sub, startBtn, mapBtn, settingsHint].forEach(o => o.destroy());
          this.isMoving = false;
          this._startShootTimer();
          if (this.levelIndex >= 80) {
            this.time.delayedCall(500, () => this.showMsg('🔥 HELL MODE', '#ff4444', 2000));
          }
        }
      });
    });
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

  // ── Pause menu ────────────────────────────────────────────────────────

  _openPause() {
    if (!this.pauseMenu) {
      const { PauseMenu } = window.__PauseMenuClass__;
      this.pauseMenu = new PauseMenu(
        () => {},
        () => {
          this.pauseMenu.destroy();
          this.pauseMenu = null;
          this._cleanupListeners();
          this.scene.start('GameScene', { levelIndex: 0 });
        },
        (musicOn)  => { console.log('Music:', musicOn); },
        (soundsOn) => { console.log('Sounds:', soundsOn); },
        () => {
          // onSeeIntro
          localStorage.removeItem('te_seen_intro');
          this.pauseMenu.destroy();
          this.pauseMenu = null;
          this._cleanupListeners();
          this.scene.start('BootScene');
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