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
          <rect width="64" height="64" fill="#1a0e06" rx="6"/>
          <rect x="6" y="22" width="52" height="34" fill="#2e1c0c" rx="3"/>
          <rect x="2" y="14" width="14" height="28" fill="#3d2510" rx="3"/>
          <rect x="48" y="14" width="14" height="28" fill="#3d2510" rx="3"/>
          <rect x="24" y="34" width="16" height="22" fill="#140a02" rx="2"/>
          <rect x="5" y="16" width="10" height="8" fill="#ffa000" opacity="0.9" rx="1"/>
          <rect x="49" y="16" width="10" height="8" fill="#ffa000" opacity="0.9" rx="1"/>
          <rect x="7" y="17" width="6" height="5" fill="#ffe066" opacity="0.5" rx="1"/>
          <rect x="51" y="17" width="6" height="5" fill="#ffe066" opacity="0.5" rx="1"/>
          <polygon points="32,4 35,12 28,12" fill="#cc3300" opacity="0.9"/>
          <polygon points="32,2 34,10 30,10" fill="#ff6600" opacity="0.85"/>
          <rect x="31" y="10" width="2" height="12" fill="#8b5e1a"/>
          <rect x="28" y="36" width="2" height="2" fill="#8b5e1a" rx="1"/>
          <rect x="34" y="36" width="2" height="2" fill="#8b5e1a" rx="1"/>
          <rect x="28" y="40" width="2" height="2" fill="#7a5216" rx="1"/>
          <rect x="34" y="40" width="2" height="2" fill="#7a5216" rx="1"/>
          <rect x="6" y="44" width="52" height="2" fill="#4d2e10" rx="1"/>
        </svg>`,

      forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect width="64" height="64" fill="#0b1f04" rx="6"/>
          <ellipse cx="32" cy="54" rx="22" ry="7" fill="#0f2a05" opacity="0.7"/>
          <polygon points="32,44 24,56 40,56" fill="#2a5c0a"/>
          <polygon points="32,36 22,52 42,52" fill="#357014"/>
          <polygon points="32,24 18,46 46,46" fill="#3f8a18"/>
          <polygon points="32,14 16,42 48,42" fill="#4aaa1e"/>
          <polygon points="32,6 22,28 42,28" fill="#5bc226"/>
          <rect x="30" y="44" width="4" height="12" fill="#5a3006" rx="1"/>
          <circle cx="32" cy="10" r="5" fill="#ffe066" opacity="0.85"/>
          <circle cx="32" cy="10" r="3" fill="#fff5b0" opacity="0.9"/>
          <line x1="32" y1="3" x2="32" y2="6" stroke="#ffe066" stroke-width="1.5" opacity="0.7"/>
          <line x1="37" y1="6" x2="35" y2="8" stroke="#ffe066" stroke-width="1.2" opacity="0.6"/>
          <line x1="27" y1="6" x2="29" y2="8" stroke="#ffe066" stroke-width="1.2" opacity="0.6"/>
          <circle cx="18" cy="38" r="1.5" fill="#88cc44" opacity="0.7"/>
          <circle cx="46" cy="40" r="1.2" fill="#66bb33" opacity="0.6"/>
          <circle cx="24" cy="50" r="1" fill="#aade55" opacity="0.5"/>
        </svg>`,

      volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect width="64" height="64" fill="#120400" rx="6"/>
          <ellipse cx="32" cy="60" rx="26" ry="6" fill="#1e0800" opacity="0.8"/>
          <polygon points="32,4 58,58 6,58" fill="#1f0700"/>
          <polygon points="32,12 54,56 10,56" fill="#2e0d00"/>
          <polygon points="32,20 48,54 16,54" fill="#3d1200"/>
          <ellipse cx="32" cy="24" rx="10" ry="7" fill="#cc2200"/>
          <ellipse cx="32" cy="24" rx="7" ry="5" fill="#ff5500"/>
          <ellipse cx="32" cy="24" rx="4" ry="3" fill="#ff9900"/>
          <ellipse cx="32" cy="24" rx="2" ry="1.5" fill="#ffee00"/>
          <path d="M26,22 Q28,12 32,8 Q36,12 38,22" fill="none" stroke="#ff4400" stroke-width="1.5" opacity="0.6"/>
          <path d="M29,23 Q31,16 32,11 Q33,16 35,23" fill="none" stroke="#ffaa00" stroke-width="1" opacity="0.5"/>
          <circle cx="20" cy="50" r="1.5" fill="#ff3300" opacity="0.4"/>
          <circle cx="44" cy="48" r="1" fill="#ff6600" opacity="0.3"/>
          <circle cx="36" cy="52" r="1.2" fill="#ff2200" opacity="0.3"/>
        </svg>`,

      frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect width="64" height="64" fill="#0d1f30" rx="6"/>
          <ellipse cx="32" cy="60" rx="24" ry="5" fill="#1a3650" opacity="0.6"/>
          <rect x="14" y="22" width="36" height="34" fill="#7fc8f0" rx="3" opacity="0.85"/>
          <rect x="8" y="10" width="14" height="24" fill="#a8dff7" rx="3"/>
          <rect x="42" y="10" width="14" height="24" fill="#a8dff7" rx="3"/>
          <rect x="24" y="38" width="16" height="18" fill="#5aaacb" rx="2"/>
          <polygon points="32,3 12,16 52,16" fill="#cceeff" opacity="0.7"/>
          <polygon points="32,6 14,16 50,16" fill="#e0f5ff" opacity="0.5"/>
          <line x1="21" y1="22" x2="21" y2="56" stroke="#d0f0ff" stroke-width="0.8" opacity="0.4"/>
          <line x1="32" y1="22" x2="32" y2="38" stroke="#d0f0ff" stroke-width="0.8" opacity="0.4"/>
          <line x1="43" y1="22" x2="43" y2="56" stroke="#d0f0ff" stroke-width="0.8" opacity="0.4"/>
          <text x="32" y="33" text-anchor="middle" fill="#ffffff" font-size="13" font-family="serif" opacity="0.9">❄</text>
          <circle cx="16" cy="8" r="2" fill="#ddf4ff" opacity="0.7"/>
          <circle cx="10" cy="14" r="1.5" fill="#cceeff" opacity="0.5"/>
          <circle cx="50" cy="7" r="2" fill="#ddf4ff" opacity="0.6"/>
          <circle cx="56" cy="13" r="1.5" fill="#cceeff" opacity="0.5"/>
        </svg>`,

      void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect width="64" height="64" fill="#06000f" rx="6"/>
          <circle cx="32" cy="32" r="28" fill="#0d0018"/>
          <circle cx="32" cy="32" r="20" fill="#1a0030"/>
          <circle cx="32" cy="32" r="13" fill="#3300aa" opacity="0.4"/>
          <circle cx="32" cy="32" r="7" fill="#8800ff" opacity="0.55"/>
          <circle cx="32" cy="32" r="3" fill="#cc44ff" opacity="0.9"/>
          <line x1="4" y1="32" x2="60" y2="32" stroke="#cc00ff" stroke-width="0.8" opacity="0.45"/>
          <line x1="32" y1="4" x2="32" y2="60" stroke="#cc00ff" stroke-width="0.8" opacity="0.45"/>
          <line x1="12" y1="12" x2="52" y2="52" stroke="#aa00dd" stroke-width="0.6" opacity="0.3"/>
          <line x1="52" y1="12" x2="12" y2="52" stroke="#aa00dd" stroke-width="0.6" opacity="0.3"/>
          <circle cx="8" cy="14" r="1.2" fill="#ff44ff" opacity="0.6"/>
          <circle cx="56" cy="20" r="1" fill="#cc88ff" opacity="0.5"/>
          <circle cx="14" cy="52" r="0.8" fill="#ff88ff" opacity="0.4"/>
          <circle cx="50" cy="48" r="1" fill="#ee66ff" opacity="0.5"/>
          <circle cx="22" cy="8" r="0.7" fill="#ff00ff" opacity="0.35"/>
          <circle cx="44" cy="58" r="0.9" fill="#dd44ff" opacity="0.4"/>
        </svg>`
    };

    Object.entries(bases).forEach(([world, svg]) => {
      scene.textures.addBase64(`base_${world}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });

    const locked = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <rect width="64" height="64" fill="#0f0f0f" rx="6"/>
        <rect x="8" y="8" width="48" height="48" fill="#1c1c1c" rx="6" stroke="#2e2e2e" stroke-width="1.5"/>
        <rect x="20" y="30" width="24" height="20" fill="#383838" rx="4"/>
        <path d="M22 30 Q22 19 32 19 Q42 19 42 30" stroke="#555" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M25 30 Q25 23 32 23 Q39 23 39 30" stroke="#444" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <circle cx="32" cy="41" r="4.5" fill="#555"/>
        <circle cx="32" cy="41" r="2.5" fill="#3a3a3a"/>
        <rect x="30.5" y="41" width="3" height="6" fill="#555" rx="1"/>
        <circle cx="24" cy="14" r="1.5" fill="#333" opacity="0.7"/>
        <circle cx="40" cy="14" r="1.5" fill="#333" opacity="0.7"/>
        <circle cx="24" cy="50" r="1.5" fill="#333" opacity="0.7"/>
        <circle cx="40" cy="50" r="1.5" fill="#333" opacity="0.7"/>
      </svg>`;
    scene.textures.addBase64('base_locked', 'data:image/svg+xml;base64,' + this.svgToBase64(locked));
  }

  // ── TOWERS ────────────────────────────────────────────
  static createTowerTextures(scene) {
    const towers = {
      // DUNGEON
      fire_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="8" y="16" width="32" height="28" fill="#2a0600" rx="2"/>
          <rect x="4" y="12" width="10" height="16" fill="#3d0c00" rx="1"/>
          <rect x="34" y="12" width="10" height="16" fill="#3d0c00" rx="1"/>
          <rect x="14" y="8" width="8" height="10" fill="#3d0c00"/>
          <rect x="26" y="8" width="8" height="10" fill="#3d0c00"/>
          <rect x="6" y="10" width="3" height="4" fill="#1a0400"/>
          <rect x="10" y="10" width="3" height="4" fill="#1a0400"/>
          <rect x="35" y="10" width="3" height="4" fill="#1a0400"/>
          <rect x="39" y="10" width="3" height="4" fill="#1a0400"/>
          <rect x="15" y="6" width="3" height="4" fill="#1a0400"/>
          <rect x="27" y="6" width="3" height="4" fill="#1a0400"/>
          <rect x="14" y="22" width="6" height="8" fill="#1a0400"/>
          <rect x="28" y="22" width="6" height="8" fill="#1a0400"/>
          <rect x="20" y="26" width="8" height="18" fill="#220800"/>
          <rect x="21" y="19" width="6" height="9" fill="#110300"/>
          <ellipse cx="24" cy="19" rx="9" ry="7" fill="#cc2200" opacity="0.7"/>
          <ellipse cx="24" cy="17" rx="6" ry="5" fill="#ff5500" opacity="0.85"/>
          <ellipse cx="22" cy="14" rx="3" ry="4" fill="#ff9900"/>
          <ellipse cx="26" cy="13" rx="2" ry="3" fill="#ffbb00"/>
          <ellipse cx="24" cy="12" rx="2" ry="2" fill="#ffff88"/>
          <rect x="9" y="28" width="4" height="3" fill="#ff3300" opacity="0.4"/>
          <rect x="35" y="28" width="4" height="3" fill="#ff3300" opacity="0.4"/>
        </svg>`,

      ice_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="8" y="16" width="32" height="28" fill="#06121f" rx="2"/>
          <rect x="4" y="12" width="10" height="16" fill="#091828" rx="1"/>
          <rect x="34" y="12" width="10" height="16" fill="#091828" rx="1"/>
          <rect x="14" y="8" width="8" height="10" fill="#091828"/>
          <rect x="26" y="8" width="8" height="10" fill="#091828"/>
          <rect x="6" y="10" width="3" height="4" fill="#040d14"/>
          <rect x="10" y="10" width="3" height="4" fill="#040d14"/>
          <rect x="35" y="10" width="3" height="4" fill="#040d14"/>
          <rect x="39" y="10" width="3" height="4" fill="#040d14"/>
          <rect x="15" y="6" width="3" height="4" fill="#040d14"/>
          <rect x="27" y="6" width="3" height="4" fill="#040d14"/>
          <rect x="14" y="22" width="6" height="8" fill="#040d14"/>
          <rect x="28" y="22" width="6" height="8" fill="#040d14"/>
          <rect x="20" y="26" width="8" height="18" fill="#07101a"/>
          <line x1="24" y1="10" x2="24" y2="32" stroke="#88ccff" stroke-width="1" opacity="0.8"/>
          <line x1="12" y1="21" x2="36" y2="21" stroke="#88ccff" stroke-width="1" opacity="0.8"/>
          <line x1="15" y1="13" x2="33" y2="29" stroke="#88ccff" stroke-width="0.7" opacity="0.6"/>
          <line x1="33" y1="13" x2="15" y2="29" stroke="#88ccff" stroke-width="0.7" opacity="0.6"/>
          <circle cx="24" cy="21" r="7" fill="#0055aa" opacity="0.5"/>
          <circle cx="24" cy="21" r="4" fill="#2299ee" opacity="0.6"/>
          <circle cx="24" cy="21" r="2" fill="#aaddff" opacity="0.9"/>
          <polygon points="24,11 25.2,14.6 29,14.6 26,16.8 27.2,20.4 24,18.2 20.8,20.4 22,16.8 19,14.6 22.8,14.6" fill="#cceeff" opacity="0.5"/>
          <rect x="9" y="28" width="4" height="3" fill="#44aaff" opacity="0.3"/>
          <rect x="35" y="28" width="4" height="3" fill="#44aaff" opacity="0.3"/>
          <polygon points="7,11 8,9 9,11" fill="#aaddff" opacity="0.7"/>
          <polygon points="36,9 37,7 38,9" fill="#aaddff" opacity="0.7"/>
          <polygon points="15,7 16,5 17,7" fill="#aaddff" opacity="0.7"/>
          <polygon points="28,7 29,5 30,7" fill="#aaddff" opacity="0.7"/>
        </svg>`,

      arcane_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="8" y="16" width="32" height="28" fill="#100820" rx="2"/>
          <rect x="4" y="12" width="10" height="16" fill="#180a2e" rx="1"/>
          <rect x="34" y="12" width="10" height="16" fill="#180a2e" rx="1"/>
          <rect x="14" y="8" width="8" height="10" fill="#180a2e"/>
          <rect x="26" y="8" width="8" height="10" fill="#180a2e"/>
          <rect x="6" y="10" width="3" height="4" fill="#0b0518"/>
          <rect x="10" y="10" width="3" height="4" fill="#0b0518"/>
          <rect x="35" y="10" width="3" height="4" fill="#0b0518"/>
          <rect x="39" y="10" width="3" height="4" fill="#0b0518"/>
          <rect x="15" y="6" width="3" height="4" fill="#0b0518"/>
          <rect x="27" y="6" width="3" height="4" fill="#0b0518"/>
          <rect x="14" y="22" width="6" height="8" fill="#0b0518"/>
          <rect x="28" y="22" width="6" height="8" fill="#0b0518"/>
          <rect x="20" y="26" width="8" height="18" fill="#0e0720"/>
          <circle cx="24" cy="20" r="9" fill="#5500aa" opacity="0.4"/>
          <polygon points="24,9 26.4,16.2 34,16.2 28,21 30.4,28.2 24,24 17.6,28.2 20,21 14,16.2 21.6,16.2" fill="#bb44ff" opacity="0.85"/>
          <circle cx="24" cy="20" r="3" fill="#dd99ff" opacity="0.8"/>
          <circle cx="24" cy="20" r="1.5" fill="#ffffff" opacity="0.7"/>
          <circle cx="11" cy="18" r="1.5" fill="#9933cc" opacity="0.7"/>
          <circle cx="37" cy="18" r="1.5" fill="#9933cc" opacity="0.7"/>
          <circle cx="17" cy="12" r="1" fill="#cc55ff" opacity="0.6"/>
          <circle cx="31" cy="12" r="1" fill="#cc55ff" opacity="0.6"/>
          <rect x="9" y="28" width="4" height="3" fill="#aa44ff" opacity="0.35"/>
          <rect x="35" y="28" width="4" height="3" fill="#aa44ff" opacity="0.35"/>
        </svg>`,

      // FOREST
      fire_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="20" y="30" width="8" height="14" fill="#3d2506"/>
          <rect x="21" y="30" width="2" height="14" fill="#2a1804" opacity="0.5"/>
          <rect x="25" y="30" width="2" height="14" fill="#2a1804" opacity="0.5"/>
          <ellipse cx="24" cy="25" rx="15" ry="13" fill="#1e3605"/>
          <ellipse cx="19" cy="27" rx="8" ry="7" fill="#1a3004"/>
          <ellipse cx="29" cy="27" rx="8" ry="7" fill="#1a3004"/>
          <ellipse cx="24" cy="19" rx="11" ry="10" fill="#2a5208"/>
          <ellipse cx="24" cy="14" rx="8" ry="7" fill="#357010"/>
          <ellipse cx="20" cy="22" rx="5" ry="5" fill="#ff5500" opacity="0.85"/>
          <ellipse cx="28" cy="21" rx="4" ry="4" fill="#ff3300" opacity="0.7"/>
          <ellipse cx="24" cy="18" rx="4" ry="5" fill="#ff7700" opacity="0.9"/>
          <ellipse cx="24" cy="14" rx="3" ry="3" fill="#ffaa00"/>
          <ellipse cx="22" cy="11" rx="2" ry="2.5" fill="#ffdd00"/>
          <ellipse cx="26" cy="12" rx="1.5" ry="2" fill="#ffee88"/>
        </svg>`,

      ice_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="20" y="30" width="8" height="14" fill="#28201a"/>
          <rect x="21" y="30" width="2" height="14" fill="#1a1410" opacity="0.5"/>
          <ellipse cx="24" cy="25" rx="15" ry="13" fill="#0f2218"/>
          <ellipse cx="19" cy="27" rx="8" ry="7" fill="#0b1c13"/>
          <ellipse cx="29" cy="27" rx="8" ry="7" fill="#0b1c13"/>
          <ellipse cx="24" cy="19" rx="11" ry="10" fill="#153320"/>
          <ellipse cx="24" cy="14" rx="8" ry="7" fill="#1a4028"/>
          <ellipse cx="14" cy="22" rx="3" ry="6" fill="#cceeff" opacity="0.7"/>
          <ellipse cx="34" cy="24" rx="2.5" ry="5" fill="#cceeff" opacity="0.6"/>
          <ellipse cx="20" cy="16" rx="2" ry="4" fill="#ddeeff" opacity="0.5"/>
          <ellipse cx="28" cy="15" rx="2" ry="4" fill="#ddeeff" opacity="0.5"/>
          <line x1="24" y1="14" x2="24" y2="26" stroke="#88ccff" stroke-width="1.2" opacity="0.9"/>
          <line x1="18" y1="20" x2="30" y2="20" stroke="#88ccff" stroke-width="1.2" opacity="0.9"/>
          <line x1="19.5" y1="15.5" x2="28.5" y2="24.5" stroke="#88ccff" stroke-width="0.9" opacity="0.7"/>
          <line x1="28.5" y1="15.5" x2="19.5" y2="24.5" stroke="#88ccff" stroke-width="0.9" opacity="0.7"/>
          <circle cx="24" cy="20" r="3" fill="#55aadd" opacity="0.7"/>
          <circle cx="24" cy="20" r="1.5" fill="#aaddff" opacity="0.9"/>
        </svg>`,

      arcane_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="20" y="30" width="8" height="14" fill="#2a0f2a"/>
          <rect x="21" y="30" width="2" height="14" fill="#1a081a" opacity="0.5"/>
          <ellipse cx="24" cy="25" rx="15" ry="13" fill="#1a051a"/>
          <ellipse cx="19" cy="27" rx="8" ry="7" fill="#150415"/>
          <ellipse cx="29" cy="27" rx="8" ry="7" fill="#150415"/>
          <ellipse cx="24" cy="19" rx="11" ry="10" fill="#220822"/>
          <ellipse cx="24" cy="14" rx="8" ry="7" fill="#300a30"/>
          <circle cx="16" cy="22" r="2" fill="#cc44ff" opacity="0.6"/>
          <circle cx="32" cy="25" r="1.5" fill="#cc44ff" opacity="0.5"/>
          <circle cx="20" cy="14" r="1.5" fill="#ee88ff" opacity="0.6"/>
          <circle cx="30" cy="16" r="1" fill="#ee88ff" opacity="0.5"/>
          <circle cx="24" cy="19" r="8" fill="#6600aa" opacity="0.3"/>
          <circle cx="24" cy="19" r="5" fill="#9922dd" opacity="0.5"/>
          <circle cx="24" cy="19" r="2.5" fill="#cc66ff" opacity="0.85"/>
          <circle cx="24" cy="19" r="1" fill="#f0ccff" opacity="0.9"/>
          <line x1="24" y1="11" x2="24" y2="27" stroke="#cc44ff" stroke-width="0.5" opacity="0.4"/>
          <line x1="16" y1="19" x2="32" y2="19" stroke="#cc44ff" stroke-width="0.5" opacity="0.4"/>
        </svg>`,

      // VOLCANIC
      fire_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <polygon points="24,4 44,44 4,44" fill="#1c0300"/>
          <polygon points="24,8 41,44 7,44" fill="#2c0500"/>
          <polygon points="24,12 38,44 10,44" fill="#3a0800"/>
          <rect x="10" y="38" width="28" height="6" fill="#4a0a00"/>
          <ellipse cx="13" cy="42" rx="3" ry="2" fill="#220400"/>
          <ellipse cx="35" cy="42" rx="3" ry="2" fill="#220400"/>
          <ellipse cx="17" cy="38" rx="2" ry="3" fill="#ff1100" opacity="0.5"/>
          <ellipse cx="31" cy="38" rx="2" ry="3" fill="#ff1100" opacity="0.5"/>
          <ellipse cx="24" cy="18" rx="8" ry="6" fill="#cc1100" opacity="0.7"/>
          <ellipse cx="24" cy="15" rx="5" ry="4" fill="#ff3300" opacity="0.85"/>
          <ellipse cx="22" cy="12" rx="3" ry="3.5" fill="#ff6600"/>
          <ellipse cx="26" cy="11" rx="2" ry="3" fill="#ff8800"/>
          <ellipse cx="24" cy="9" rx="2" ry="2.5" fill="#ffcc00"/>
          <ellipse cx="24" cy="7" rx="1.5" ry="1.5" fill="#ffff88"/>
          <line x1="16" y1="30" x2="14" y2="44" stroke="#ff4400" stroke-width="0.7" opacity="0.4"/>
          <line x1="32" y1="30" x2="34" y2="44" stroke="#ff4400" stroke-width="0.7" opacity="0.4"/>
        </svg>`,

      ice_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <polygon points="24,4 44,44 4,44" fill="#000d18"/>
          <polygon points="24,8 41,44 7,44" fill="#001522"/>
          <polygon points="24,12 38,44 10,44" fill="#001d2e"/>
          <rect x="10" y="38" width="28" height="6" fill="#002233"/>
          <ellipse cx="13" cy="42" rx="3" ry="2" fill="#000a12"/>
          <ellipse cx="35" cy="42" rx="3" ry="2" fill="#000a12"/>
          <ellipse cx="17" cy="38" rx="2" ry="3" fill="#44aaff" opacity="0.4"/>
          <ellipse cx="31" cy="38" rx="2" ry="3" fill="#44aaff" opacity="0.4"/>
          <line x1="24" y1="16" x2="24" y2="32" stroke="#88ccff" stroke-width="1.2" opacity="0.85"/>
          <line x1="16" y1="24" x2="32" y2="24" stroke="#88ccff" stroke-width="1.2" opacity="0.85"/>
          <line x1="18.3" y1="18.3" x2="29.7" y2="29.7" stroke="#88ccff" stroke-width="0.9" opacity="0.65"/>
          <line x1="29.7" y1="18.3" x2="18.3" y2="29.7" stroke="#88ccff" stroke-width="0.9" opacity="0.65"/>
          <circle cx="24" cy="24" r="5" fill="#0055aa" opacity="0.5"/>
          <circle cx="24" cy="24" r="2.5" fill="#44aaee" opacity="0.7"/>
          <circle cx="24" cy="24" r="1" fill="#aaddff" opacity="0.95"/>
          <polygon points="24,13 25,16.5 24,4 23,16.5" fill="#cceeff" opacity="0.3"/>
          <line x1="16" y1="30" x2="14" y2="44" stroke="#44aaff" stroke-width="0.7" opacity="0.3"/>
          <line x1="32" y1="30" x2="34" y2="44" stroke="#44aaff" stroke-width="0.7" opacity="0.3"/>
        </svg>`,

      arcane_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <polygon points="24,4 44,44 4,44" fill="#100010"/>
          <polygon points="24,8 41,44 7,44" fill="#180018"/>
          <polygon points="24,12 38,44 10,44" fill="#200020"/>
          <rect x="10" y="38" width="28" height="6" fill="#250025"/>
          <ellipse cx="13" cy="42" rx="3" ry="2" fill="#0a000a"/>
          <ellipse cx="35" cy="42" rx="3" ry="2" fill="#0a000a"/>
          <ellipse cx="17" cy="38" rx="2" ry="3" fill="#cc00ff" opacity="0.35"/>
          <ellipse cx="31" cy="38" rx="2" ry="3" fill="#cc00ff" opacity="0.35"/>
          <circle cx="24" cy="22" r="9" fill="#550055" opacity="0.4"/>
          <polygon points="24,9 26.6,17 35,17 28.5,22 31,30.5 24,25.5 17,30.5 19.5,22 13,17 21.4,17" fill="#ee00ff" opacity="0.85"/>
          <circle cx="24" cy="22" r="3.5" fill="#ff66ff" opacity="0.7"/>
          <circle cx="24" cy="22" r="1.5" fill="#ffffff" opacity="0.65"/>
          <line x1="16" y1="30" x2="14" y2="44" stroke="#cc00ff" stroke-width="0.7" opacity="0.35"/>
          <line x1="32" y1="30" x2="34" y2="44" stroke="#cc00ff" stroke-width="0.7" opacity="0.35"/>
        </svg>`,

      // FROZEN
      fire_frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="10" y="18" width="28" height="26" fill="#8aaabb" rx="2" opacity="0.95"/>
          <rect x="6" y="12" width="10" height="18" fill="#a0bbcc" rx="1"/>
          <rect x="32" y="12" width="10" height="18" fill="#a0bbcc" rx="1"/>
          <rect x="7" y="10" width="3" height="4" fill="#7a9aaa"/>
          <rect x="11" y="10" width="3" height="4" fill="#7a9aaa"/>
          <rect x="33" y="10" width="3" height="4" fill="#7a9aaa"/>
          <rect x="37" y="10" width="3" height="4" fill="#7a9aaa"/>
          <ellipse cx="11" cy="29" rx="2" ry="5" fill="#cce0ee" opacity="0.7"/>
          <ellipse cx="37" cy="29" rx="2" ry="5" fill="#cce0ee" opacity="0.7"/>
          <ellipse cx="16" cy="15" rx="1.5" ry="3" fill="#cce0ee" opacity="0.5"/>
          <ellipse cx="33" cy="15" rx="1.5" ry="3" fill="#cce0ee" opacity="0.5"/>
          <rect x="18" y="28" width="12" height="16" fill="#7a9aaa"/>
          <rect x="20" y="20" width="8" height="10" fill="#5a7888"/>
          <ellipse cx="24" cy="20" rx="7" ry="6" fill="#cc2200" opacity="0.85"/>
          <ellipse cx="24" cy="17" rx="4.5" ry="4" fill="#ff5500" opacity="0.9"/>
          <ellipse cx="22" cy="14" rx="2.5" ry="3" fill="#ff9900"/>
          <ellipse cx="26" cy="13" rx="1.5" ry="2.5" fill="#ffcc00"/>
          <ellipse cx="24" cy="12" rx="1.5" ry="1.5" fill="#ffff88"/>
        </svg>`,

      ice_frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="10" y="18" width="28" height="26" fill="#b8d8ee" rx="2"/>
          <rect x="6" y="12" width="10" height="18" fill="#cce4f4" rx="1"/>
          <rect x="32" y="12" width="10" height="18" fill="#cce4f4" rx="1"/>
          <rect x="7" y="10" width="3" height="4" fill="#9bbdd0"/>
          <rect x="11" y="10" width="3" height="4" fill="#9bbdd0"/>
          <rect x="33" y="10" width="3" height="4" fill="#9bbdd0"/>
          <rect x="37" y="10" width="3" height="4" fill="#9bbdd0"/>
          <ellipse cx="11" cy="29" rx="2" ry="5" fill="#ddf0ff" opacity="0.8"/>
          <ellipse cx="37" cy="29" rx="2" ry="5" fill="#ddf0ff" opacity="0.8"/>
          <ellipse cx="16" cy="15" rx="1.5" ry="3" fill="#ddf0ff" opacity="0.6"/>
          <ellipse cx="33" cy="15" rx="1.5" ry="3" fill="#ddf0ff" opacity="0.6"/>
          <rect x="18" y="28" width="12" height="16" fill="#99bbcc"/>
          <rect x="20" y="20" width="8" height="10" fill="#7799aa"/>
          <line x1="24" y1="19" x2="24" y2="32" stroke="#2277aa" stroke-width="1.5" opacity="0.9"/>
          <line x1="17" y1="25.5" x2="31" y2="25.5" stroke="#2277aa" stroke-width="1.5" opacity="0.9"/>
          <line x1="19" y1="21" x2="29" y2="30" stroke="#2277aa" stroke-width="1" opacity="0.7"/>
          <line x1="29" y1="21" x2="19" y2="30" stroke="#2277aa" stroke-width="1" opacity="0.7"/>
          <circle cx="24" cy="25.5" r="4" fill="#55aadd" opacity="0.6"/>
          <circle cx="24" cy="25.5" r="2" fill="#aaddff" opacity="0.9"/>
          <polygon points="11,11 12,9 13,11" fill="#aaccdd" opacity="0.8"/>
          <polygon points="34,11 35,9 36,11" fill="#aaccdd" opacity="0.8"/>
          <polygon points="7,11 8,9 9,11" fill="#aaccdd" opacity="0.7"/>
          <polygon points="38,11 39,9 40,11" fill="#aaccdd" opacity="0.7"/>
        </svg>`,

      arcane_frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect x="10" y="18" width="28" height="26" fill="#6677aa" rx="2"/>
          <rect x="6" y="12" width="10" height="18" fill="#7788bb" rx="1"/>
          <rect x="32" y="12" width="10" height="18" fill="#7788bb" rx="1"/>
          <rect x="7" y="10" width="3" height="4" fill="#5566990"/>
          <rect x="11" y="10" width="3" height="4" fill="#556699"/>
          <rect x="33" y="10" width="3" height="4" fill="#556699"/>
          <rect x="37" y="10" width="3" height="4" fill="#556699"/>
          <ellipse cx="11" cy="29" rx="2" ry="5" fill="#99aacc" opacity="0.7"/>
          <ellipse cx="37" cy="29" rx="2" ry="5" fill="#99aacc" opacity="0.7"/>
          <rect x="18" y="28" width="12" height="16" fill="#556699"/>
          <rect x="20" y="20" width="8" height="10" fill="#445588"/>
          <circle cx="24" cy="24" r="8" fill="#330066" opacity="0.45"/>
          <polygon points="24,13 26.6,21 35,21 28.5,26 31,34 24,29 17,34 19.5,26 13,21 21.4,21" fill="#cc88ff" opacity="0.9"/>
          <circle cx="24" cy="24" r="3" fill="#dd99ff" opacity="0.75"/>
          <circle cx="24" cy="24" r="1.3" fill="#ffffff" opacity="0.7"/>
          <circle cx="8" cy="18" r="1.5" fill="#aa77ff" opacity="0.65"/>
          <circle cx="40" cy="18" r="1.5" fill="#aa77ff" opacity="0.65"/>
          <circle cx="8" cy="24" r="1" fill="#cc99ff" opacity="0.5"/>
          <circle cx="40" cy="24" r="1" fill="#cc99ff" opacity="0.5"/>
        </svg>`,

      // VOID
      fire_void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="26" r="20" fill="#0a000a"/>
          <circle cx="24" cy="26" r="16" fill="#140014"/>
          <circle cx="24" cy="26" r="11" fill="#1e001e"/>
          <ellipse cx="18" cy="22" rx="3" ry="5" fill="#330000" opacity="0.6"/>
          <ellipse cx="30" cy="22" rx="3" ry="5" fill="#330000" opacity="0.6"/>
          <circle cx="16" cy="18" r="2" fill="#550000" opacity="0.7"/>
          <circle cx="32" cy="18" r="2" fill="#550000" opacity="0.7"/>
          <ellipse cx="24" cy="20" rx="8" ry="7" fill="#aa0022" opacity="0.8"/>
          <ellipse cx="24" cy="17" rx="5" ry="5" fill="#dd0044" opacity="0.85"/>
          <ellipse cx="22" cy="14" rx="3" ry="3.5" fill="#ff2266"/>
          <ellipse cx="26" cy="13" rx="2" ry="2.5" fill="#ff5599"/>
          <ellipse cx="24" cy="11" rx="2" ry="2" fill="#ffaabb"/>
          <ellipse cx="24" cy="9" rx="1.3" ry="1.3" fill="#ffddee"/>
          <circle cx="14" cy="30" r="1.5" fill="#440011" opacity="0.6"/>
          <circle cx="34" cy="30" r="1.5" fill="#440011" opacity="0.6"/>
          <circle cx="19" cy="34" r="1" fill="#330011" opacity="0.5"/>
          <circle cx="29" cy="34" r="1" fill="#330011" opacity="0.5"/>
        </svg>`,

      ice_void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="26" r="20" fill="#000a14"/>
          <circle cx="24" cy="26" r="16" fill="#000f1e"/>
          <circle cx="24" cy="26" r="11" fill="#001428"/>
          <ellipse cx="18" cy="22" rx="3" ry="5" fill="#001a30" opacity="0.7"/>
          <ellipse cx="30" cy="22" rx="3" ry="5" fill="#001a30" opacity="0.7"/>
          <circle cx="16" cy="18" r="2" fill="#003355" opacity="0.8"/>
          <circle cx="32" cy="18" r="2" fill="#003355" opacity="0.8"/>
          <line x1="24" y1="18" x2="24" y2="34" stroke="#00ccff" stroke-width="1.5" opacity="0.9"/>
          <line x1="16" y1="26" x2="32" y2="26" stroke="#00ccff" stroke-width="1.5" opacity="0.9"/>
          <line x1="18.3" y1="20.3" x2="29.7" y2="31.7" stroke="#00ccff" stroke-width="1" opacity="0.7"/>
          <line x1="29.7" y1="20.3" x2="18.3" y2="31.7" stroke="#00ccff" stroke-width="1" opacity="0.7"/>
          <circle cx="24" cy="26" r="6" fill="#004488" opacity="0.55"/>
          <circle cx="24" cy="26" r="3" fill="#0088cc" opacity="0.7"/>
          <circle cx="24" cy="26" r="1.3" fill="#00eeff" opacity="0.95"/>
          <circle cx="14" cy="30" r="1.5" fill="#002244" opacity="0.7"/>
          <circle cx="34" cy="30" r="1.5" fill="#002244" opacity="0.7"/>
          <circle cx="16" cy="34" r="1" fill="#003366" opacity="0.5"/>
          <circle cx="32" cy="34" r="1" fill="#003366" opacity="0.5"/>
        </svg>`,

      arcane_void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="26" r="20" fill="#08000f"/>
          <circle cx="24" cy="26" r="16" fill="#10001e"/>
          <circle cx="24" cy="26" r="11" fill="#18002d"/>
          <ellipse cx="18" cy="22" rx="3" ry="5" fill="#200040" opacity="0.7"/>
          <ellipse cx="30" cy="22" rx="3" ry="5" fill="#200040" opacity="0.7"/>
          <circle cx="16" cy="18" r="2" fill="#440066" opacity="0.8"/>
          <circle cx="32" cy="18" r="2" fill="#440066" opacity="0.8"/>
          <circle cx="24" cy="24" r="9" fill="#440088" opacity="0.4"/>
          <polygon points="24,11 27,20 37,20 29.5,26 32.5,35.5 24,29.5 15.5,35.5 18.5,26 11,20 21,20" fill="#ff00ff" opacity="0.9"/>
          <circle cx="24" cy="24" r="3.5" fill="#ee66ff" opacity="0.75"/>
          <circle cx="24" cy="24" r="1.5" fill="#ffffff" opacity="0.7"/>
          <circle cx="14" cy="30" r="1.5" fill="#660088" opacity="0.65"/>
          <circle cx="34" cy="30" r="1.5" fill="#660088" opacity="0.65"/>
          <circle cx="18" cy="34" r="1" fill="#550077" opacity="0.5"/>
          <circle cx="30" cy="34" r="1" fill="#550077" opacity="0.5"/>
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
          <rect width="48" height="48" fill="#0e0e1f"/>
          <rect x="1" y="1" width="46" height="46" fill="#12122a" rx="1"/>
          <!-- Stone blocks -->
          <rect x="2" y="2" width="20" height="10" fill="#1a1a35" rx="1" opacity="0.8"/>
          <rect x="24" y="2" width="22" height="10" fill="#181832" rx="1" opacity="0.8"/>
          <rect x="2" y="14" width="14" height="10" fill="#181832" rx="1" opacity="0.8"/>
          <rect x="18" y="14" width="28" height="10" fill="#1a1a35" rx="1" opacity="0.8"/>
          <rect x="2" y="26" width="22" height="10" fill="#1a1a35" rx="1" opacity="0.8"/>
          <rect x="26" y="26" width="20" height="10" fill="#181832" rx="1" opacity="0.8"/>
          <rect x="2" y="38" width="16" height="8" fill="#181832" rx="1" opacity="0.8"/>
          <rect x="20" y="38" width="26" height="8" fill="#1a1a35" rx="1" opacity="0.8"/>
          <!-- Mortar lines -->
          <line x1="0" y1="12" x2="48" y2="12" stroke="#0a0a1a" stroke-width="1.5"/>
          <line x1="0" y1="24" x2="48" y2="24" stroke="#0a0a1a" stroke-width="1.5"/>
          <line x1="0" y1="36" x2="48" y2="36" stroke="#0a0a1a" stroke-width="1.5"/>
          <line x1="22" y1="0" x2="22" y2="12" stroke="#0a0a1a" stroke-width="1.5"/>
          <line x1="16" y1="12" x2="16" y2="24" stroke="#0a0a1a" stroke-width="1.5"/>
          <line x1="30" y1="24" x2="30" y2="36" stroke="#0a0a1a" stroke-width="1.5"/>
          <line x1="18" y1="36" x2="18" y2="48" stroke="#0a0a1a" stroke-width="1.5"/>
          <!-- Moss patches -->
          <circle cx="6" cy="6" r="2" fill="#1a3a1a" opacity="0.5"/>
          <circle cx="38" cy="18" r="1.5" fill="#1a3a1a" opacity="0.4"/>
          <circle cx="14" cy="32" r="2" fill="#1a3a1a" opacity="0.3"/>
          <!-- Cracks -->
          <path d="M28 14 L31 18 L29 22" stroke="#0a0a18" stroke-width="0.8" fill="none" opacity="0.6"/>
          <path d="M8 36 L11 40" stroke="#0a0a18" stroke-width="0.8" fill="none" opacity="0.5"/>
          <!-- Subtle glow -->
          <rect x="0" y="0" width="48" height="48" fill="url(#dg)" opacity="0.05"/>
          <defs>
            <radialGradient id="dg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#4444ff"/>
              <stop offset="100%" stop-color="#000000"/>
            </radialGradient>
          </defs>
        </svg>`,

      forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#071507"/>
          <rect x="1" y="1" width="46" height="46" fill="#0a1c0a" rx="1"/>
          <!-- Dirt patches -->
          <ellipse cx="12" cy="12" rx="8" ry="6" fill="#0d220d" opacity="0.7"/>
          <ellipse cx="36" cy="8" rx="6" ry="5" fill="#0f240f" opacity="0.6"/>
          <ellipse cx="24" cy="28" rx="10" ry="7" fill="#0d220d" opacity="0.7"/>
          <ellipse cx="8" cy="38" rx="6" ry="4" fill="#0f240f" opacity="0.5"/>
          <ellipse cx="40" cy="36" rx="7" ry="5" fill="#0d220d" opacity="0.6"/>
          <!-- Roots -->
          <path d="M0 20 Q8 18 12 24 Q16 30 10 34" stroke="#0f1a08" stroke-width="1.5" fill="none" opacity="0.6"/>
          <path d="M48 10 Q40 14 36 20 Q32 26 38 30" stroke="#0f1a08" stroke-width="1.5" fill="none" opacity="0.5"/>
          <path d="M20 48 Q22 40 28 36 Q34 32 36 40" stroke="#0f1a08" stroke-width="1.2" fill="none" opacity="0.4"/>
          <!-- Small stones -->
          <ellipse cx="30" cy="14" rx="3" ry="2" fill="#1a2a1a" opacity="0.6"/>
          <ellipse cx="6" cy="28" rx="2" ry="1.5" fill="#1a2a1a" opacity="0.5"/>
          <!-- Leaves/debris -->
          <circle cx="8" cy="8" r="2" fill="#1a3a0a" opacity="0.7"/>
          <circle cx="42" cy="22" r="1.5" fill="#1a3a0a" opacity="0.6"/>
          <circle cx="18" cy="40" r="2.5" fill="#1a3a0a" opacity="0.5"/>
          <circle cx="36" cy="42" r="1.5" fill="#143010" opacity="0.6"/>
          <circle cx="26" cy="6" r="1" fill="#1a3a0a" opacity="0.5"/>
          <!-- Mushroom -->
          <ellipse cx="42" cy="44" rx="3" ry="1.5" fill="#2a1a0a" opacity="0.5"/>
          <rect x="41" y="40" width="2" height="4" fill="#221408" opacity="0.4"/>
          <ellipse cx="42" cy="40" rx="3.5" ry="2" fill="#aa2222" opacity="0.4"/>
          <!-- Grid lines subtle -->
          <line x1="0" y1="0" x2="48" y2="0" stroke="#0d200d" stroke-width="0.5"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#0d200d" stroke-width="0.5"/>
        </svg>`,

      volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#150400"/>
          <rect x="1" y="1" width="46" height="46" fill="#1c0600" rx="1"/>
          <!-- Lava cracks background -->
          <path d="M0 24 Q6 20 10 26 Q14 32 20 28 Q26 24 30 30 Q36 36 42 30 Q46 26 48 28" stroke="#8b1a00" stroke-width="2" fill="none" opacity="0.4"/>
          <path d="M10 0 Q12 8 8 14 Q4 20 10 28 Q16 36 12 44 Q10 46 12 48" stroke="#8b1a00" stroke-width="1.5" fill="none" opacity="0.3"/>
          <path d="M36 0 Q34 6 38 12 Q42 18 38 26 Q34 34 40 42 Q44 46 40 48" stroke="#8b1a00" stroke-width="1.5" fill="none" opacity="0.3"/>
          <!-- Lava glow in cracks -->
          <path d="M0 24 Q6 20 10 26 Q14 32 20 28 Q26 24 30 30 Q36 36 42 30 Q46 26 48 28" stroke="#ff4400" stroke-width="1" fill="none" opacity="0.5"/>
          <!-- Rock surfaces -->
          <polygon points="2,2 18,2 22,8 2,12" fill="#1e0800" opacity="0.8"/>
          <polygon points="26,2 46,2 46,10 30,14" fill="#1c0700" opacity="0.8"/>
          <polygon points="2,32 16,28 20,38 2,42" fill="#1e0800" opacity="0.7"/>
          <polygon points="32,32 46,28 46,44 28,44" fill="#1c0700" opacity="0.7"/>
          <!-- Lava pools -->
          <ellipse cx="24" cy="24" rx="5" ry="3" fill="#cc3300" opacity="0.3"/>
          <ellipse cx="24" cy="24" rx="3" ry="2" fill="#ff6600" opacity="0.4"/>
          <ellipse cx="24" cy="24" rx="1.5" ry="1" fill="#ffaa00" opacity="0.5"/>
          <!-- Ash particles -->
          <circle cx="10" cy="6" r="1" fill="#3a2a20" opacity="0.6"/>
          <circle cx="38" cy="16" r="1" fill="#3a2a20" opacity="0.5"/>
          <circle cx="16" cy="38" r="1.5" fill="#3a2a20" opacity="0.4"/>
          <circle cx="42" cy="42" r="1" fill="#3a2a20" opacity="0.5"/>
          <!-- Heat shimmer lines -->
          <line x1="0" y1="0" x2="48" y2="0" stroke="#2a0f00" stroke-width="0.5"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#2a0f00" stroke-width="0.5"/>
        </svg>`,

      frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#050c18"/>
          <rect x="1" y="1" width="46" height="46" fill="#071525" rx="1"/>
          <!-- Ice surface variation -->
          <rect x="2" y="2" width="20" height="20" fill="#081a2e" rx="2" opacity="0.6"/>
          <rect x="24" y="2" width="22" height="14" fill="#091c30" rx="2" opacity="0.6"/>
          <rect x="2" y="24" width="14" height="22" fill="#091c30" rx="2" opacity="0.6"/>
          <rect x="18" y="18" width="28" height="28" fill="#081a2e" rx="2" opacity="0.6"/>
          <!-- Snow patches -->
          <ellipse cx="10" cy="10" rx="7" ry="5" fill="#c8e0f0" opacity="0.12"/>
          <ellipse cx="38" cy="6" rx="6" ry="4" fill="#d0e8f8" opacity="0.1"/>
          <ellipse cx="6" cy="36" rx="5" ry="4" fill="#c8e0f0" opacity="0.1"/>
          <ellipse cx="36" cy="38" rx="8" ry="5" fill="#d0e8f8" opacity="0.12"/>
          <ellipse cx="22" cy="24" rx="6" ry="4" fill="#c8e0f0" opacity="0.08"/>
          <!-- Ice cracks -->
          <path d="M20 20 L24 16 L28 20 L26 26 L30 28" stroke="#aaccee" stroke-width="0.8" fill="none" opacity="0.3"/>
          <path d="M6 22 L10 18 L14 22" stroke="#aaccee" stroke-width="0.7" fill="none" opacity="0.25"/>
          <path d="M34 30 L38 26 L42 30 L40 36" stroke="#aaccee" stroke-width="0.7" fill="none" opacity="0.25"/>
          <!-- Snowflakes -->
          <line x1="10" y1="10" x2="10" y2="16" stroke="#cce8ff" stroke-width="0.8" opacity="0.4"/>
          <line x1="7" y1="13" x2="13" y2="13" stroke="#cce8ff" stroke-width="0.8" opacity="0.4"/>
          <line x1="8" y1="11" x2="12" y2="15" stroke="#cce8ff" stroke-width="0.8" opacity="0.3"/>
          <line x1="12" y1="11" x2="8" y2="15" stroke="#cce8ff" stroke-width="0.8" opacity="0.3"/>
          <line x1="38" y1="32" x2="38" y2="38" stroke="#cce8ff" stroke-width="0.8" opacity="0.35"/>
          <line x1="35" y1="35" x2="41" y2="35" stroke="#cce8ff" stroke-width="0.8" opacity="0.35"/>
          <line x1="36" y1="33" x2="40" y2="37" stroke="#cce8ff" stroke-width="0.7" opacity="0.25"/>
          <line x1="40" y1="33" x2="36" y2="37" stroke="#cce8ff" stroke-width="0.7" opacity="0.25"/>
          <!-- Small snowflake -->
          <line x1="22" y1="44" x2="22" y2="48" stroke="#cce8ff" stroke-width="0.7" opacity="0.3"/>
          <line x1="20" y1="46" x2="24" y2="46" stroke="#cce8ff" stroke-width="0.7" opacity="0.3"/>
          <!-- Ice reflection -->
          <rect x="0" y="0" width="48" height="48" fill="url(#fg)" opacity="0.06"/>
          <defs>
            <radialGradient id="fg" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#aaddff"/>
              <stop offset="100%" stop-color="#000000"/>
            </radialGradient>
          </defs>
          <!-- Grid -->
          <line x1="0" y1="0" x2="48" y2="0" stroke="#102030" stroke-width="0.5"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#102030" stroke-width="0.5"/>
        </svg>`,

      void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <rect width="48" height="48" fill="#020005"/>
          <rect x="1" y="1" width="46" height="46" fill="#040008" rx="1"/>
          <!-- Void rifts -->
          <path d="M0 16 Q8 12 14 18 Q20 24 16 30 Q12 36 18 42 Q22 46 20 48" stroke="#220033" stroke-width="2" fill="none" opacity="0.6"/>
          <path d="M32 0 Q36 8 30 14 Q24 20 28 28 Q32 36 28 42 Q26 46 30 48" stroke="#220033" stroke-width="2" fill="none" opacity="0.5"/>
          <!-- Glowing rift lines -->
          <path d="M0 16 Q8 12 14 18 Q20 24 16 30 Q12 36 18 42" stroke="#8800cc" stroke-width="0.8" fill="none" opacity="0.4"/>
          <path d="M32 0 Q36 8 30 14 Q24 20 28 28 Q32 36 28 42" stroke="#8800cc" stroke-width="0.8" fill="none" opacity="0.35"/>
          <!-- Void tiles -->
          <rect x="2" y="2" width="12" height="12" fill="#060008" rx="1" opacity="0.8"/>
          <rect x="16" y="2" width="14" height="12" fill="#050007" rx="1" opacity="0.8"/>
          <rect x="32" y="2" width="14" height="12" fill="#060008" rx="1" opacity="0.8"/>
          <rect x="2" y="16" width="12" height="14" fill="#050007" rx="1" opacity="0.8"/>
          <rect x="34" y="16" width="12" height="14" fill="#060008" rx="1" opacity="0.8"/>
          <rect x="2" y="32" width="14" height="14" fill="#060008" rx="1" opacity="0.8"/>
          <rect x="18" y="34" width="12" height="12" fill="#050007" rx="1" opacity="0.8"/>
          <rect x="32" y="32" width="14" height="14" fill="#060008" rx="1" opacity="0.8"/>
          <!-- Stars/particles -->
          <circle cx="6" cy="6" r="0.8" fill="#ff44ff" opacity="0.5"/>
          <circle cx="42" cy="10" r="1" fill="#cc00ff" opacity="0.4"/>
          <circle cx="22" cy="20" r="0.8" fill="#ff44ff" opacity="0.3"/>
          <circle cx="8" cy="44" r="1" fill="#cc00ff" opacity="0.5"/>
          <circle cx="44" cy="38" r="0.8" fill="#ff44ff" opacity="0.4"/>
          <circle cx="36" cy="24" r="0.6" fill="#ffffff" opacity="0.3"/>
          <circle cx="14" cy="30" r="0.6" fill="#ffffff" opacity="0.25"/>
          <circle cx="28" cy="44" r="0.8" fill="#cc00ff" opacity="0.4"/>
          <!-- Void glow -->
          <rect x="0" y="0" width="48" height="48" fill="url(#vg)" opacity="0.08"/>
          <defs>
            <radialGradient id="vg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#6600aa"/>
              <stop offset="100%" stop-color="#000000"/>
            </radialGradient>
          </defs>
          <!-- Grid -->
          <line x1="0" y1="0" x2="48" y2="0" stroke="#0f0015" stroke-width="0.5"/>
          <line x1="0" y1="0" x2="0" y2="48" stroke="#0f0015" stroke-width="0.5"/>
        </svg>`
    };

    Object.entries(tiles).forEach(([world, svg]) => {
      scene.textures.addBase64(`terrain_${world}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });
  }

  // ── BULLETS ───────────────────────────────────────────
  static createBulletTextures(scene) {
    const bullets = {
      fire: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <defs>
          <radialGradient id="fg" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#fff7aa"/>
            <stop offset="40%" stop-color="#ff9900"/>
            <stop offset="100%" stop-color="#cc2200" stop-opacity="0.9"/>
          </radialGradient>
        </defs>
        <circle cx="8" cy="8" r="7" fill="#ff4400" opacity="0.35"/>
        <circle cx="8" cy="8" r="5" fill="url(#fg)"/>
        <ellipse cx="7" cy="6" rx="1.5" ry="2" fill="#fffde0" opacity="0.7"/>
      </svg>`,

      ice: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <defs>
          <radialGradient id="ig" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#eef9ff"/>
            <stop offset="45%" stop-color="#55bbff"/>
            <stop offset="100%" stop-color="#0055cc" stop-opacity="0.9"/>
          </radialGradient>
        </defs>
        <circle cx="8" cy="8" r="7" fill="#44aaff" opacity="0.25"/>
        <circle cx="8" cy="8" r="5" fill="url(#ig)"/>
        <line x1="8" y1="4" x2="8" y2="12" stroke="#cceeff" stroke-width="0.8" opacity="0.8"/>
        <line x1="4" y1="8" x2="12" y2="8" stroke="#cceeff" stroke-width="0.8" opacity="0.8"/>
        <line x1="5.2" y1="5.2" x2="10.8" y2="10.8" stroke="#cceeff" stroke-width="0.6" opacity="0.6"/>
        <line x1="10.8" y1="5.2" x2="5.2" y2="10.8" stroke="#cceeff" stroke-width="0.6" opacity="0.6"/>
        <circle cx="7" cy="6.5" r="1" fill="white" opacity="0.6"/>
      </svg>`,

      arcane: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <defs>
          <radialGradient id="ag" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#f0ddff"/>
            <stop offset="40%" stop-color="#cc55ff"/>
            <stop offset="100%" stop-color="#550099" stop-opacity="0.95"/>
          </radialGradient>
        </defs>
        <circle cx="8" cy="8" r="7" fill="#9900ff" opacity="0.2"/>
        <circle cx="8" cy="8" r="5" fill="url(#ag)"/>
        <polygon points="8,3.5 9.3,7 13,7 10.2,9.2 11.2,13 8,10.8 4.8,13 5.8,9.2 3,7 6.7,7"
                fill="white" opacity="0.35" transform="scale(0.52) translate(9.3,9.3)"/>
        <circle cx="7" cy="6.5" r="1" fill="#f8eeff" opacity="0.7"/>
      </svg>`,
    };

    Object.entries(bullets).forEach(([type, svg]) => {
      scene.textures.addBase64(
        `bullet_${type}`,
        'data:image/svg+xml;base64,' + this.svgToBase64(svg)
      );
    });
  }
}