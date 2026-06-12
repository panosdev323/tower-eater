import { ProgressManager } from '../systems/ProgressManager.js';

export class IntroScreen {
  constructor(onPlay) {
    this.onPlay   = onPlay;
    this.step     = 0;
    this.overlay  = null;
    this._build();
  }

  _build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'intro-overlay';
    document.body.appendChild(this.overlay);
    this._render();
  }

  _render() {
    const saved = ProgressManager.getSavedLevel();
    const steps = [
      this._stepWelcome(),
      this._stepObjective(),
      this._stepWorlds(),
      this._stepTowers(),
      this._stepReady(saved),
    ];

    this.overlay.innerHTML = `
      <div id="intro-modal">
        <div id="intro-progress">
          ${steps.map((_, i) => `<div class="intro-dot ${i === this.step ? 'active' : i < this.step ? 'done' : ''}"></div>`).join('')}
        </div>
        <div id="intro-content">
          ${steps[this.step]}
        </div>
        <div id="intro-actions">
          ${this.step > 0 ? `<button id="intro-back">← Back</button>` : '<div></div>'}
          ${this.step < steps.length - 1
            ? `<button id="intro-next" class="intro-primary">Next →</button>`
            : saved > 0
              ? `<div id="intro-play-group">
                   <button id="intro-continue" class="intro-primary">▶ Continue (Lv.${saved + 1})</button>
                   <button id="intro-new">New Game</button>
                 </div>`
              : `<button id="intro-play" class="intro-primary">▶ Play Now</button>`
          }
        </div>
      </div>
    `;

    // Events
    document.getElementById('intro-next')?.addEventListener('click', () => {
      this.step++;
      this._render();
    });
    document.getElementById('intro-back')?.addEventListener('click', () => {
      this.step--;
      this._render();
    });
    document.getElementById('intro-play')?.addEventListener('click', () => {
      this._close(0);
    });
    document.getElementById('intro-continue')?.addEventListener('click', () => {
      this._close(saved);
    });
    document.getElementById('intro-new')?.addEventListener('click', () => {
      ProgressManager.reset();
      this._close(0);
    });
  }

  _close(levelIndex) {
    this.overlay.style.opacity = '0';
    this.overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      this.overlay.remove();
      this.onPlay(levelIndex);
    }, 400);
  }

  // ── Step content ──────────────────────────────────────────────────

  _stepWelcome() {
    return `
      <div class="intro-step">
        <div class="intro-icon">👾</div>
        <h1 class="intro-title">Tower<span>Eater</span></h1>
        <p class="intro-lead">You are the monster.</p>
        <p class="intro-body">
          The towers stand between you and the base.
          Eat towers to mutate. Every tower makes you stronger. Build the perfect monster and reach the base.
        </p>
      </div>
    `;
  }

  _stepObjective() {
    return `
      <div class="intro-step">
        <div class="intro-icon">🎯</div>
        <h2 class="intro-heading">How to Play</h2>
        <div class="intro-rules">
          <div class="intro-rule">
            <span class="rule-icon">👆</span>
            <span><strong>Swipe</strong> to move your monster across the grid</span>
          </div>
          <div class="intro-rule">
            <span class="rule-icon">🍴</span>
            <span><strong>Eat towers</strong> by stepping on them — absorb their power</span>
          </div>
          <div class="intro-rule">
            <span class="rule-icon">🔒</span>
            <span>The base is <strong>locked</strong> until you eat enough towers</span>
          </div>
          <div class="intro-rule">
            <span class="rule-icon">🏁</span>
            <span><strong>Reach the base</strong> to complete the level</span>
          </div>
          <div class="intro-rule">
            <span class="rule-icon">💀</span>
            <span>Towers shoot at you — dodge or tank with armor</span>
          </div>
        </div>
      </div>
    `;
  }

  _stepWorlds() {
    return `
      <div class="intro-step">
        <div class="intro-icon">🌍</div>
        <h2 class="intro-heading">120 Levels · 6 Worlds</h2>
        <div class="intro-worlds">
          <div class="world-row dungeon">
            <span class="world-icon">⚔️</span>
            <div>
              <strong>Levels 1–10 · Dungeon</strong>
              <p>Stone towers. Standard bullets. Learn the basics.</p>
            </div>
          </div>
          <div class="world-row forest">
            <span class="world-icon">🌿</span>
            <div>
              <strong>Levels 11–20 · Cursed Forest</strong>
              <p>⚡ Bullets travel faster. Stay mobile.</p>
            </div>
          </div>
          <div class="world-row volcanic">
            <span class="world-icon">🌋</span>
            <div>
              <strong>Levels 21–30 · Volcanic</strong>
              <p>💣 Every 3rd shot is an AoE grenade. Double damage.</p>
            </div>
          </div>
          <div class="world-row frozen">
            <span class="world-icon">❄️</span>
            <div>
              <strong>Levels 31–40 · Frozen</strong>
              <p>❄️ Ice hits freeze you. Plan your route.</p>
            </div>
          </div>
          <div class="world-row void">
            <span class="world-icon">💀</span>
            <div>
              <strong>Levels 41–50 · Void</strong>
              <p>👁 Towers move randomly. Nothing stays where it was.</p>
            </div>
          </div>
          <div class="world-row poison">
            <span class="world-icon">☠️</span>
            <div>
              <strong>Levels 51–60 · Poison</strong>
              <p>🧪 Gas clouds slow you, push you and deal damage. Eat poison towers to resist.</p>
            </div>
          </div>
          <div class="world-row hell">
            <span class="world-icon">🔥</span>
            <div>
              <strong>Levels 61–110 · Mix Worlds</strong>
              <p>All mechanics combined. Every level is a new combination.</p>
            </div>
          </div>
          <div class="world-row hell" style="border-color:#ff2200">
            <span class="world-icon">💥</span>
            <div>
              <strong>Levels 111–120 · Hell Mode</strong>
              <p>Maximum towers, minimum delay. Only the worthy survive.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _stepTowers() {
    return `
      <div class="intro-step">
        <div class="intro-icon">🏰</div>
        <h2 class="intro-heading">Tower Types</h2>
        <p class="intro-body" style="margin-bottom:20px">Each tower you eat grants a permanent bonus for that run:</p>
        <div class="intro-towers">
          <div class="tower-card fire">
            <div class="tower-header">
              <span class="tower-dot fire-dot"></span>
              <strong>🔥 Fire Tower</strong>
            </div>
            <p>+Speed — your monster moves faster</p>
          </div>
          <div class="tower-card ice">
            <div class="tower-header">
              <span class="tower-dot ice-dot"></span>
              <strong>❄️ Ice Tower</strong>
            </div>
            <p>+Armor — reduces all incoming damage</p>
          </div>
          <div class="tower-card arcane">
            <div class="tower-header">
              <span class="tower-dot arcane-dot"></span>
              <strong>✨ Arcane Tower</strong>
            </div>
            <p>+Power & +Max HP — hit harder, survive longer</p>
          </div>
          <div class="tower-card poison">
            <div class="tower-header">
              <span class="tower-dot poison-dot"></span>
              <strong>☠️ Poison Tower</strong>
            </div>
            <p>+Resistance — chance to resist gas cloud effects</p>
          </div>
        </div>
        <div class="intro-tip">
          💡 The path hint (🗺️) shows the shortest route to your next target
        </div>
      </div>
    `;
  }

  _stepReady(saved) {
    return `
      <div class="intro-step intro-step-ready">
        <div class="intro-icon anim-pulse">👾</div>
        <h2 class="intro-heading">Ready to Feed?</h2>
        <div class="intro-checklist">
          <div class="check-item">
            <span class="check">✓</span> Swipe to navigate the grid
          </div>
          <div class="check-item">
            <span class="check">✓</span> Eat required towers to unlock base
          </div>
          <div class="check-item">
            <span class="check">✓</span> Reach the base to advance
          </div>
          <div class="check-item">
            <span class="check">✓</span> 120 levels of evolving chaos await
          </div>
        </div>
        ${saved > 0 ? `<p class="intro-saved">⚡ You reached <strong>Level ${saved + 1}</strong> last time</p>` : ''}
      </div>
    `;
  }

  destroy() {
    this.overlay?.remove();
  }
}