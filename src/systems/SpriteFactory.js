export class SpriteFactory {

  static svgToBase64(svg) {
    return btoa(unescape(encodeURIComponent(svg)));
  }

  static getWorld(levelId) {
    if (levelId <= 10) return 'dungeon';
    if (levelId <= 20) return 'forest';
    if (levelId <= 30) return 'volcanic';
    if (levelId <= 40) return 'frozen';
    return 'void';
  }

  static getWorldTheme(world) {
    const themes = {
      dungeon:  { bg: '#0d0d1a', grid: '#1a1a2e', gridLine: '#2a2a4a', accent: '#8844ff' },
      forest:   { bg: '#0a1a0a', grid: '#0f2a0f', gridLine: '#1a3a1a', accent: '#44ff88' },
      volcanic: { bg: '#1a0500', grid: '#2a0a00', gridLine: '#3a1500', accent: '#ff6600' },
      frozen:   { bg: '#050a1a', grid: '#0a1525', gridLine: '#152535', accent: '#44ccff' },
      void:     { bg: '#000000', grid: '#0a000f', gridLine: '#15001a', accent: '#ff44ff' },
    };
    return themes[world] || themes.dungeon;
  }

  static preloadAll(scene) {
    // Δημιουργούμε textures από SVG strings
    this.createMonsterTexture(scene);
    this.createBaseTextures(scene);
    this.createTowerTextures(scene);
    this.createTerrainTextures(scene);
    this.createBulletTextures(scene);
  }

  // ── MONSTER ──────────────────────────────────────────
  static createMonsterTexture(scene) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="48" height="48"><g transform="translate(0,0)" style=""><path d="m190.625 50.125-16.063 31.97c-26.47-6.543-52.935-15.91-79.406-27.97 4.048 15.106 9.757 28.843 16.813 41.22-13.293-1.35-25.644.808-36.314 6.968-30.07 17.358-39.36 61.958-28.906 115.03-7.755 11.533-14.913 23.72-21.406 36.47 127.87 296.268 344.194 298.2 460.344 0a350.272 350.272 0 0 0-20.907-35.75c10.682-53.392 1.427-98.313-28.78-115.75-8.185-4.725-17.332-7.1-27.156-7.344 6.868-12.262 12.456-25.87 16.47-40.845-28.423 13.94-56.83 24.012-85.252 30.438l-16.937-34.438-66.625 42.03-65.875-42.03zm-90 65.28c3.398 0 6.66.525 9.72 1.5-6.847 2.012-11.845 8.348-11.845 15.845 0 9.115 7.385 16.5 16.5 16.5 7.474 0 13.782-4.967 15.813-11.78a31.934 31.934 0 0 1 1.437 9.56c0 17.57-14.056 31.595-31.625 31.595-17.57 0-31.594-14.024-31.594-31.594 0-17.567 14.03-31.624 31.595-31.624zm312.28 0c3.4 0 6.66.525 9.72 1.5-6.843 2.013-11.844 8.35-11.844 15.845 0 9.115 7.386 16.5 16.5 16.5 7.475 0 13.783-4.967 15.814-11.78a31.934 31.934 0 0 1 1.437 9.56c0 17.57-14.054 31.595-31.624 31.595s-31.594-14.024-31.594-31.594c0-17.567 14.028-31.624 31.594-31.624zM253.19 179.5c5.915.007 11.83.18 17.75.47l9.656 47.718 14.812-45.72a370.055 370.055 0 0 1 37.28 6.22l-9.623 46.062 34.656-39.594a347.279 347.279 0 0 1 40.936 15l-21.812 32.875 43.656-22.31c17.728 9.406 34.555 20.44 50.125 33.093-5.817 12.747-11.89 24.787-18.22 36.125L409 282.217l32.28 25.97c-6.193 9.888-12.583 19.157-19.155 27.812l-39.656-22.25 24.686 40.625a277.517 277.517 0 0 1-22.22 22.5L348.565 343l16.03 50.344c-11.668 8.392-23.624 15.267-35.78 20.625l-16.313-42-7.25 50.436a160.613 160.613 0 0 1-34.375 5.625l-11.438-42.374-10.718 42.03c-12.57-1.073-25.133-3.658-37.626-7.686l-6.906-48.03-15.25 39.31c-12.093-5.644-24.063-12.686-35.813-21.124l15-47.156-34.28 31.906c-7.864-6.824-15.596-14.318-23.19-22.437l23.532-38.72-38.53 21.625c-6.953-8.455-13.74-17.5-20.376-27.094l32.376-26.06-44.625 7.405c-7.107-11.416-13.996-23.51-20.624-36.313 14.295-12.626 29.98-23.62 46.688-33l43.437 22.22-21.968-33.126c13.475-6.172 27.486-11.398 41.876-15.656l-1.032.625 34.906 39.875-9.75-46.656a352.139 352.139 0 0 1 37.282-6l14.937 46.094 9.69-47.907c4.9-.19 9.8-.285 14.718-.28z" fill="#417505" fill-opacity="1"></path></g></svg>`;
    scene.textures.addBase64('monster', 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
  }

  // ── BASES ─────────────────────────────────────────────
  static createBaseTextures(scene) {
    const bases = {
      dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect x="8" y="20" width="48" height="36" fill="#3a2a1a" rx="2"/>
          <rect x="4" y="16" width="12" height="24" fill="#4a3a2a" rx="2"/>
          <rect x="48" y="16" width="12" height="24" fill="#4a3a2a" rx="2"/>
          <rect x="24" y="32" width="16" height="24" fill="#2a1a0a" rx="1"/>
          <rect x="10" y="18" width="8" height="6" fill="#ffaa00" opacity="0.8"/>
          <rect x="46" y="18" width="8" height="6" fill="#ffaa00" opacity="0.8"/>
          <text x="32" y="15" text-anchor="middle" fill="#ffdd00" font-size="10" font-weight="bold">⚑</text>
        </svg>`,
      forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <ellipse cx="32" cy="40" rx="24" ry="16" fill="#1a3a0a"/>
          <ellipse cx="32" cy="30" rx="18" ry="14" fill="#2a5a0a"/>
          <ellipse cx="32" cy="20" rx="12" ry="10" fill="#3a7a0a"/>
          <rect x="28" y="44" width="8" height="12" fill="#5a3a0a"/>
          <circle cx="32" cy="20" r="4" fill="#ffdd00" opacity="0.8"/>
        </svg>`,
      volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <polygon points="32,4 58,56 6,56" fill="#2a0a00"/>
          <polygon points="32,12 52,52 12,52" fill="#3a1000"/>
          <ellipse cx="32" cy="20" rx="8" ry="6" fill="#ff4400"/>
          <ellipse cx="32" cy="20" rx="5" ry="4" fill="#ffaa00"/>
          <ellipse cx="32" cy="20" rx="3" ry="2" fill="#ffff00"/>
        </svg>`,
      frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect x="16" y="20" width="32" height="36" fill="#aaddff" rx="2" opacity="0.9"/>
          <rect x="10" y="12" width="12" height="20" fill="#cceeff" rx="2"/>
          <rect x="42" y="12" width="12" height="20" fill="#cceeff" rx="2"/>
          <rect x="24" y="36" width="16" height="20" fill="#88bbdd" rx="1"/>
          <text x="32" y="30" text-anchor="middle" fill="#ffffff" font-size="14">❄</text>
        </svg>`,
      void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <circle cx="32" cy="32" r="28" fill="#0a000f"/>
          <circle cx="32" cy="32" r="20" fill="#15001f" opacity="0.8"/>
          <circle cx="32" cy="32" r="12" fill="#ff00ff" opacity="0.3"/>
          <circle cx="32" cy="32" r="6" fill="#ff44ff" opacity="0.8"/>
          <line x1="4" y1="32" x2="60" y2="32" stroke="#ff00ff" stroke-width="1" opacity="0.5"/>
          <line x1="32" y1="4" x2="32" y2="60" stroke="#ff00ff" stroke-width="1" opacity="0.5"/>
        </svg>`
    };

    Object.entries(bases).forEach(([world, svg]) => {
      scene.textures.addBase64(`base_${world}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });

    // Locked base
    const locked = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <rect x="8" y="8" width="48" height="48" fill="#1a1a1a" rx="4" stroke="#333333" stroke-width="2"/>
        <rect x="20" y="30" width="24" height="20" fill="#444444" rx="3"/>
        <path d="M20 30 Q20 18 32 18 Q44 18 44 30" stroke="#666666" stroke-width="3" fill="none"/>
        <circle cx="32" cy="40" r="4" fill="#888888"/>
        <rect x="30" y="40" width="4" height="6" fill="#888888"/>
      </svg>`;
    scene.textures.addBase64('base_locked', 'data:image/svg+xml;base64,' + this.svgToBase64(locked));
  }

  // ── TOWERS ────────────────────────────────────────────
  static createTowerTextures(scene) {
    const towers = {
      // DUNGEON
      fire_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="8" y="16" width="32" height="28" fill="#3a0a00" rx="2"/>
          <rect x="4" y="12" width="10" height="16" fill="#4a1000" rx="1"/>
          <rect x="34" y="12" width="10" height="16" fill="#4a1000" rx="1"/>
          <rect x="14" y="8" width="8" height="10" fill="#4a1000"/>
          <rect x="26" y="8" width="8" height="10" fill="#4a1000"/>
          <ellipse cx="24" cy="20" rx="8" ry="6" fill="#ff4400" opacity="0.9"/>
          <ellipse cx="24" cy="18" rx="5" ry="4" fill="#ffaa00"/>
          <ellipse cx="24" cy="16" rx="3" ry="3" fill="#ffff00"/>
        </svg>`,
      ice_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="8" y="16" width="32" height="28" fill="#0a1a3a" rx="2"/>
          <rect x="4" y="12" width="10" height="16" fill="#0a2040" rx="1"/>
          <rect x="34" y="12" width="10" height="16" fill="#0a2040" rx="1"/>
          <rect x="14" y="8" width="8" height="10" fill="#0a2040"/>
          <rect x="26" y="8" width="8" height="10" fill="#0a2040"/>
          <text x="24" y="26" text-anchor="middle" fill="#aaddff" font-size="16">❄</text>
        </svg>`,
      arcane_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="8" y="16" width="32" height="28" fill="#1a0a3a" rx="2"/>
          <rect x="4" y="12" width="10" height="16" fill="#2a0a4a" rx="1"/>
          <rect x="34" y="12" width="10" height="16" fill="#2a0a4a" rx="1"/>
          <polygon points="24,8 28,18 38,18 30,24 33,34 24,28 15,34 18,24 10,18 20,18" fill="#aa44ff" opacity="0.9"/>
        </svg>`,

      // FOREST
      fire_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="20" y="28" width="8" height="16" fill="#5a3a0a"/>
          <ellipse cx="24" cy="22" rx="14" ry="12" fill="#2a4a0a"/>
          <ellipse cx="24" cy="16" rx="10" ry="9" fill="#3a6a0a"/>
          <ellipse cx="24" cy="18" rx="5" ry="5" fill="#ff6600" opacity="0.9"/>
          <ellipse cx="24" cy="15" rx="3" ry="3" fill="#ffaa00"/>
        </svg>`,
      ice_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="20" y="28" width="8" height="16" fill="#3a2a1a"/>
          <ellipse cx="24" cy="22" rx="14" ry="12" fill="#1a3a2a"/>
          <ellipse cx="24" cy="16" rx="10" ry="9" fill="#2a5a3a"/>
          <text x="24" y="22" text-anchor="middle" fill="#aaffdd" font-size="14">❄</text>
        </svg>`,
      arcane_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="20" y="28" width="8" height="16" fill="#3a1a3a"/>
          <ellipse cx="24" cy="22" rx="14" ry="12" fill="#2a0a2a"/>
          <ellipse cx="24" cy="16" rx="10" ry="9" fill="#4a0a4a"/>
          <circle cx="24" cy="18" r="6" fill="#cc44ff" opacity="0.8"/>
          <circle cx="24" cy="18" r="3" fill="#ffffff" opacity="0.6"/>
        </svg>`,

      // VOLCANIC
      fire_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <polygon points="24,4 42,44 6,44" fill="#2a0500"/>
          <polygon points="24,10 38,40 10,40" fill="#3a0a00"/>
          <ellipse cx="24" cy="18" rx="7" ry="5" fill="#ff2200"/>
          <ellipse cx="24" cy="15" rx="4" ry="3" fill="#ff6600"/>
          <ellipse cx="24" cy="13" rx="2" ry="2" fill="#ffff00"/>
        </svg>`,
      ice_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <polygon points="24,4 42,44 6,44" fill="#001a2a"/>
          <polygon points="24,10 38,40 10,40" fill="#002a3a"/>
          <text x="24" y="28" text-anchor="middle" fill="#44ccff" font-size="16">❄</text>
        </svg>`,
      arcane_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <polygon points="24,4 42,44 6,44" fill="#1a001a"/>
          <polygon points="24,10 38,40 10,40" fill="#2a002a"/>
          <polygon points="24,8 28,20 40,20 30,27 34,39 24,32 14,39 18,27 8,20 20,20" fill="#ff44ff" opacity="0.8"/>
        </svg>`,

      // FROZEN
      fire_frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="10" y="18" width="28" height="26" fill="#aaccee" rx="2" opacity="0.9"/>
          <rect x="6" y="12" width="10" height="18" fill="#bbddff" rx="1"/>
          <rect x="32" y="12" width="10" height="18" fill="#bbddff" rx="1"/>
          <ellipse cx="24" cy="20" rx="6" ry="5" fill="#ff4400" opacity="0.9"/>
          <ellipse cx="24" cy="17" rx="3" ry="3" fill="#ffaa00"/>
        </svg>`,
      ice_frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="10" y="18" width="28" height="26" fill="#cceeff" rx="2"/>
          <rect x="6" y="12" width="10" height="18" fill="#ddeeff" rx="1"/>
          <rect x="32" y="12" width="10" height="18" fill="#ddeeff" rx="1"/>
          <text x="24" y="30" text-anchor="middle" fill="#0088cc" font-size="18">❄</text>
        </svg>`,
      arcane_frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="10" y="18" width="28" height="26" fill="#8899cc" rx="2"/>
          <rect x="6" y="12" width="10" height="18" fill="#99aadd" rx="1"/>
          <rect x="32" y="12" width="10" height="18" fill="#99aadd" rx="1"/>
          <polygon points="24,8 28,20 40,18 30,26 34,38 24,30 14,38 18,26 8,18 20,20" fill="#cc88ff" opacity="0.9"/>
        </svg>`,

      // VOID
      fire_void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="28" r="18" fill="#0f000f"/>
          <circle cx="24" cy="28" r="13" fill="#1f001f"/>
          <ellipse cx="24" cy="22" rx="7" ry="6" fill="#ff0044" opacity="0.9"/>
          <ellipse cx="24" cy="19" rx="4" ry="4" fill="#ff4488"/>
          <ellipse cx="24" cy="17" rx="2" ry="2" fill="#ffaacc"/>
        </svg>`,
      ice_void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="28" r="18" fill="#000f1f"/>
          <circle cx="24" cy="28" r="13" fill="#001f2f"/>
          <text x="24" y="32" text-anchor="middle" fill="#00ffff" font-size="16">❄</text>
        </svg>`,
      arcane_void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="28" r="18" fill="#0f000f"/>
          <circle cx="24" cy="28" r="13" fill="#1f001f"/>
          <polygon points="24,8 27,18 38,16 29,23 33,34 24,27 15,34 19,23 10,16 21,18" fill="#ff00ff" opacity="0.9"/>
        </svg>`
    };

    Object.entries(towers).forEach(([key, svg]) => {
        scene.textures.addBase64(`tower_${key}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });
  }

  // ── TERRAIN ───────────────────────────────────────────
  static createTerrainTextures(scene) {
    const tiles = {
      dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#111122"/>
          <rect x="1" y="1" width="46" height="46" fill="#141428" rx="1"/>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#1e1e3a" stroke-width="1"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#1e1e3a" stroke-width="1"/>
          <rect x="4" y="4" width="8" height="4" fill="#1a1a30" rx="1" opacity="0.5"/>
          <rect x="24" y="28" width="10" height="3" fill="#1a1a30" rx="1" opacity="0.5"/>
        </svg>`,
      forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#0a1a0a"/>
          <rect x="1" y="1" width="46" height="46" fill="#0d200d" rx="1"/>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#152515" stroke-width="1"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#152515" stroke-width="1"/>
          <circle cx="8" cy="8" r="2" fill="#1a3a1a" opacity="0.6"/>
          <circle cx="38" cy="32" r="3" fill="#1a3a1a" opacity="0.4"/>
          <circle cx="20" cy="40" r="2" fill="#1a3a1a" opacity="0.5"/>
        </svg>`,
      volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#1a0500"/>
          <rect x="1" y="1" width="46" height="46" fill="#200800" rx="1"/>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#2a0f00" stroke-width="1"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#2a0f00" stroke-width="1"/>
          <path d="M10 40 Q20 35 30 40 Q38 44 44 38" stroke="#ff2200" stroke-width="1" fill="none" opacity="0.3"/>
          <ellipse cx="36" cy="42" rx="4" ry="2" fill="#ff4400" opacity="0.2"/>
        </svg>`,
      frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#060e1a"/>
          <rect x="1" y="1" width="46" height="46" fill="#081525" rx="1"/>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#102030" stroke-width="1"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#102030" stroke-width="1"/>
          <polygon points="10,10 12,6 14,10 12,14" fill="#aaddff" opacity="0.15"/>
          <polygon points="36,30 38,26 40,30 38,34" fill="#aaddff" opacity="0.1"/>
        </svg>`,
      void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#030005"/>
          <rect x="1" y="1" width="46" height="46" fill="#050008" rx="1"/>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#0f0015" stroke-width="1"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#0f0015" stroke-width="1"/>
          <circle cx="12" cy="15" r="1" fill="#ff00ff" opacity="0.3"/>
          <circle cx="38" cy="8" r="1" fill="#ff00ff" opacity="0.2"/>
          <circle cx="25" cy="38" r="1.5" fill="#8800ff" opacity="0.3"/>
        </svg>`
    };

    Object.entries(tiles).forEach(([world, svg]) => {
        scene.textures.addBase64(`terrain_${world}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });
  }

  // ── BULLETS ───────────────────────────────────────────
  static createBulletTextures(scene) {
    const bullets = {
      fire:   `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><circle cx="6" cy="6" r="5" fill="#ff6600"/><circle cx="6" cy="6" r="3" fill="#ffaa00"/></svg>`,
      ice:    `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><circle cx="6" cy="6" r="5" fill="#44aaff"/><circle cx="6" cy="6" r="3" fill="#aaddff"/></svg>`,
      arcane: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><circle cx="6" cy="6" r="5" fill="#aa44ff"/><circle cx="6" cy="6" r="3" fill="#dd88ff"/></svg>`,
    };
    Object.entries(bullets).forEach(([type, svg]) => {
        scene.textures.addBase64(`bullet_${type}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });
  }
}