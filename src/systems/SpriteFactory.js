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
      poison: { bg: '#060f02', grid: '#091403', gridLine: '#122206', accent: '#44ff22' },
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
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
          <rect width="64" height="64" fill="#0e0804" rx="5"/>
          <rect x="4" y="24" width="56" height="36" fill="#1e1208" rx="3"/>
          <rect x="5" y="38" width="26" height="1" fill="#2a1a0a" opacity="0.7"/>
          <rect x="33" y="38" width="26" height="1" fill="#2a1a0a" opacity="0.7"/>
          <rect x="5" y="48" width="26" height="1" fill="#2a1a0a" opacity="0.7"/>
          <rect x="33" y="48" width="26" height="1" fill="#2a1a0a" opacity="0.7"/>
          <rect x="19" y="30" width="1" height="30" fill="#2a1a0a" opacity="0.5"/>
          <rect x="44" y="30" width="1" height="30" fill="#2a1a0a" opacity="0.5"/>
          <rect x="1" y="12" width="16" height="32" fill="#2a1608" rx="2"/>
          <rect x="1" y="8" width="4" height="8" fill="#2a1608" rx="1"/>
          <rect x="7" y="8" width="4" height="8" fill="#2a1608" rx="1"/>
          <rect x="13" y="8" width="4" height="8" fill="#2a1608" rx="1"/>
          <rect x="2" y="14" width="6" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="10" y="14" width="5" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="4" y="19" width="7" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="2" y="24" width="5" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="9" y="24" width="6" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="4" y="16" width="8" height="7" fill="#110700" rx="1"/>
          <rect x="5" y="17" width="6" height="5" fill="#ff8c00" opacity="0.85" rx="1"/>
          <rect x="6" y="18" width="4" height="3" fill="#ffe066" opacity="0.5" rx="1"/>
          <rect x="47" y="12" width="16" height="32" fill="#2a1608" rx="2"/>
          <rect x="47" y="8" width="4" height="8" fill="#2a1608" rx="1"/>
          <rect x="53" y="8" width="4" height="8" fill="#2a1608" rx="1"/>
          <rect x="59" y="8" width="4" height="8" fill="#2a1608" rx="1"/>
          <rect x="48" y="14" width="6" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="56" y="14" width="5" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="50" y="19" width="7" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="48" y="24" width="5" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="55" y="24" width="6" height="3" fill="#321c0a" rx="1" opacity="0.8"/>
          <rect x="52" y="16" width="8" height="7" fill="#110700" rx="1"/>
          <rect x="53" y="17" width="6" height="5" fill="#ff8c00" opacity="0.85" rx="1"/>
          <rect x="54" y="18" width="4" height="3" fill="#ffe066" opacity="0.5" rx="1"/>
          <rect x="16" y="20" width="32" height="24" fill="#241206" rx="2"/>
          <rect x="17" y="22" width="9" height="4" fill="#2e1808" rx="1" opacity="0.8"/>
          <rect x="28" y="22" width="8" height="4" fill="#2e1808" rx="1" opacity="0.8"/>
          <rect x="38" y="22" width="9" height="4" fill="#2e1808" rx="1" opacity="0.8"/>
          <rect x="17" y="28" width="7" height="4" fill="#2e1808" rx="1" opacity="0.8"/>
          <rect x="26" y="28" width="10" height="4" fill="#2e1808" rx="1" opacity="0.8"/>
          <rect x="38" y="28" width="9" height="4" fill="#2e1808" rx="1" opacity="0.8"/>
          <rect x="25" y="34" width="14" height="18" fill="#0a0502" rx="1"/>
          <ellipse cx="32" cy="34" rx="7" ry="5" fill="#0a0502"/>
          <rect x="28" y="36" width="1.5" height="14" fill="#1a0d04" rx="1"/>
          <rect x="31" y="36" width="1.5" height="14" fill="#1a0d04" rx="1"/>
          <rect x="34" y="36" width="1.5" height="14" fill="#1a0d04" rx="1"/>
          <rect x="26" y="42" width="12" height="1.5" fill="#1a0d04" rx="1"/>
          <rect x="31" y="4" width="2" height="16" fill="#5c3a10"/>
          <polygon points="33,4 42,8 33,12" fill="#8b0000"/>
          <polygon points="33,4 42,8 33,12" fill="#cc2200" opacity="0.7"/>
          <rect x="17" y="16" width="4" height="6" fill="#241206" rx="1"/>
          <rect x="23" y="16" width="4" height="6" fill="#241206" rx="1"/>
          <rect x="37" y="16" width="4" height="6" fill="#241206" rx="1"/>
          <rect x="43" y="16" width="4" height="6" fill="#241206" rx="1"/>
          <rect x="20" y="30" width="2" height="5" fill="#5c3a10" rx="1"/>
          <rect x="19" y="27" width="4" height="4" fill="#ff8c00" opacity="0.9" rx="1"/>
          <rect x="20" y="28" width="2" height="2" fill="#ffe066" opacity="0.6" rx="1"/>
          <rect x="42" y="30" width="2" height="5" fill="#5c3a10" rx="1"/>
          <rect x="41" y="27" width="4" height="4" fill="#ff8c00" opacity="0.9" rx="1"/>
          <rect x="42" y="28" width="2" height="2" fill="#ffe066" opacity="0.6" rx="1"/>
          <rect x="4" y="58" width="56" height="2" fill="#2e1808" rx="1" opacity="0.5"/>
        </svg>`,

      forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
          <rect width="64" height="64" fill="#071403" rx="5"/>
          <ellipse cx="32" cy="58" rx="26" ry="7" fill="#0d2404"/>
          <rect x="8" y="56" width="8" height="1" fill="#142e05" rx="1" opacity="0.6"/>
          <rect x="22" y="58" width="10" height="1" fill="#142e05" rx="1" opacity="0.6"/>
          <rect x="38" y="57" width="7" height="1" fill="#142e05" rx="1" opacity="0.6"/>
          <rect x="48" y="58" width="8" height="1" fill="#142e05" rx="1" opacity="0.6"/>
          <rect x="29" y="54" width="2" height="5" fill="#3d2008" rx="1"/>
          <rect x="33" y="55" width="2" height="4" fill="#3d2008" rx="1"/>
          <rect x="26" y="56" width="3" height="3" fill="#3d2008" rx="1" opacity="0.7"/>
          <rect x="35" y="57" width="3" height="2" fill="#3d2008" rx="1" opacity="0.7"/>
          <rect x="29" y="38" width="6" height="18" fill="#4a2a0a" rx="2"/>
          <rect x="30" y="40" width="1" height="14" fill="#3a2008" rx="1" opacity="0.5"/>
          <rect x="33" y="43" width="1" height="10" fill="#3a2008" rx="1" opacity="0.4"/>
          <rect x="29" y="48" width="6" height="1" fill="#5a3410" rx="1" opacity="0.4"/>
          <rect x="22" y="38" width="10" height="3" fill="#4a2a0a" rx="1" transform="rotate(-20 27 39)"/>
          <rect x="32" y="36" width="10" height="3" fill="#4a2a0a" rx="1" transform="rotate(20 37 37)"/>
          <polygon points="10,48 6,56 14,56" fill="#1a3d08" opacity="0.7"/>
          <polygon points="10,42 5,56 15,56" fill="#1f4a0a" opacity="0.6"/>
          <rect x="9" y="54" width="2" height="4" fill="#3d2008" opacity="0.7" rx="1"/>
          <polygon points="54,48 50,56 58,56" fill="#1a3d08" opacity="0.7"/>
          <polygon points="54,42 49,56 59,56" fill="#1f4a0a" opacity="0.6"/>
          <rect x="53" y="54" width="2" height="4" fill="#3d2008" opacity="0.7" rx="1"/>
          <polygon points="32,46 18,58 46,58" fill="#1e4f08"/>
          <polygon points="32,40 16,56 48,56" fill="#266010"/>
          <polygon points="32,32 17,50 47,50" fill="#2e7414"/>
          <polygon points="32,24 15,46 49,46" fill="#388c1a"/>
          <polygon points="32,16 18,40 46,40" fill="#42a620"/>
          <polygon points="32,8 20,34 44,34" fill="#4ec228"/>
          <polygon points="32,8 20,34 26,34" fill="#5ad42e" opacity="0.4"/>
          <polygon points="32,16 18,40 24,40" fill="#52c228" opacity="0.3"/>
          <polygon points="32,24 15,46 22,46" fill="#46aa22" opacity="0.3"/>
          <polygon points="32,20 28,34 36,34" fill="#1e5c0a" opacity="0.4"/>
          <polygon points="32,28 27,42 37,42" fill="#1e5c0a" opacity="0.3"/>
          <circle cx="32" cy="9" r="6" fill="#b8ff60" opacity="0.15"/>
          <circle cx="32" cy="9" r="4" fill="#ccff80" opacity="0.3"/>
          <circle cx="32" cy="9" r="2.5" fill="#eeffaa" opacity="0.85"/>
          <circle cx="32" cy="9" r="1.2" fill="#ffffff" opacity="0.9"/>
          <line x1="32" y1="2" x2="32" y2="5" stroke="#b8ff60" stroke-width="1.2" opacity="0.5"/>
          <line x1="37" y1="4" x2="35.5" y2="6.5" stroke="#b8ff60" stroke-width="1" opacity="0.4"/>
          <line x1="27" y1="4" x2="28.5" y2="6.5" stroke="#b8ff60" stroke-width="1" opacity="0.4"/>
          <line x1="39" y1="9" x2="36" y2="9" stroke="#b8ff60" stroke-width="1" opacity="0.3"/>
          <line x1="25" y1="9" x2="28" y2="9" stroke="#b8ff60" stroke-width="1" opacity="0.3"/>
          <circle cx="14" cy="36" r="1.2" fill="#aaff44" opacity="0.7"/>
          <circle cx="50" cy="32" r="1" fill="#88ee33" opacity="0.6"/>
          <circle cx="20" cy="50" r="0.8" fill="#ccff66" opacity="0.5"/>
          <circle cx="46" cy="48" r="1" fill="#aaff44" opacity="0.55"/>
          <circle cx="10" cy="44" r="0.7" fill="#88dd44" opacity="0.4"/>
          <circle cx="53" cy="44" r="0.8" fill="#aaf044" opacity="0.45"/>
          <ellipse cx="22" cy="57" rx="3" ry="1.2" fill="#cc4422" opacity="0.8"/>
          <rect x="21" y="55" width="2" height="3" fill="#eeddcc" opacity="0.7" rx="1"/>
          <ellipse cx="44" cy="58" rx="2.5" ry="1" fill="#cc3311" opacity="0.7"/>
          <rect x="43" y="56" width="2" height="3" fill="#eeddcc" opacity="0.6" rx="1"/>
          <path d="M29 42 Q26 44 27 47 Q25 49 27 51" stroke="#2a6610" stroke-width="1.2" fill="none" opacity="0.7"/>
          <circle cx="27" cy="44" r="1.5" fill="#338814" opacity="0.6"/>
          <circle cx="26" cy="48" r="1.2" fill="#2d7a10" opacity="0.5"/>
        </svg>`,

      volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
          <rect width="64" height="64" fill="#0a0200" rx="5"/>
          <ellipse cx="32" cy="62" rx="30" ry="10" fill="#330800" opacity="0.8"/>
          <ellipse cx="32" cy="64" rx="22" ry="7" fill="#550a00" opacity="0.6"/>
          <path d="M0 58 Q8 54 12 56 Q16 58 20 55 Q24 52 28 56 Q30 58 32 57" fill="none" stroke="#cc3300" stroke-width="2.5" opacity="0.5"/>
          <path d="M0 60 Q8 56 12 58 Q16 60 20 57 Q24 54 28 58 Q30 60 32 59" fill="#aa2200" opacity="0.3"/>
          <path d="M64 58 Q56 54 52 56 Q48 58 44 55 Q40 52 36 56 Q34 58 32 57" fill="none" stroke="#cc3300" stroke-width="2.5" opacity="0.5"/>
          <path d="M10 62 Q14 58 18 60 Q22 62 26 59" fill="none" stroke="#ff4400" stroke-width="1" opacity="0.4"/>
          <path d="M40 61 Q44 57 48 59 Q52 61 56 58" fill="none" stroke="#ff3300" stroke-width="1" opacity="0.4"/>
          <path d="M20 64 Q24 60 28 62" fill="none" stroke="#ff5500" stroke-width="0.8" opacity="0.3"/>
          <polygon points="32,6 62,60 2,60" fill="#180500"/>
          <polygon points="32,10 58,58 6,58" fill="#1f0700"/>
          <polygon points="32,14 54,56 10,56" fill="#2a0a00"/>
          <polygon points="32,18 50,54 14,54" fill="#320c00" opacity="0.6"/>
          <path d="M32,22 Q28,32 24,40 Q22,46 20,54" fill="none" stroke="#cc3300" stroke-width="2" opacity="0.5"/>
          <path d="M32,22 Q36,32 40,40 Q42,46 44,54" fill="none" stroke="#cc3300" stroke-width="2" opacity="0.5"/>
          <path d="M32,24 Q29,34 27,44 Q26,50 25,56" fill="none" stroke="#ff5500" stroke-width="1" opacity="0.35"/>
          <path d="M32,24 Q35,34 37,44 Q38,50 39,56" fill="none" stroke="#ff5500" stroke-width="1" opacity="0.35"/>
          <ellipse cx="22" cy="50" rx="2" ry="1.2" fill="#ff4400" opacity="0.5"/>
          <ellipse cx="42" cy="50" rx="2" ry="1.2" fill="#ff4400" opacity="0.5"/>
          <ellipse cx="24" cy="54" rx="1.5" ry="0.8" fill="#ff6600" opacity="0.4"/>
          <ellipse cx="40" cy="54" rx="1.5" ry="0.8" fill="#ff6600" opacity="0.4"/>
          <ellipse cx="32" cy="22" rx="12" ry="5" fill="#3d1000"/>
          <ellipse cx="32" cy="21" rx="11" ry="4" fill="#220800"/>
          <ellipse cx="32" cy="22" rx="9" ry="3.5" fill="#881400" opacity="0.9"/>
          <ellipse cx="32" cy="22" rx="7" ry="2.8" fill="#cc2200" opacity="0.9"/>
          <ellipse cx="32" cy="22" rx="5" ry="2" fill="#ff4400" opacity="0.95"/>
          <ellipse cx="32" cy="22" rx="3.5" ry="1.4" fill="#ff7700" opacity="0.95"/>
          <ellipse cx="32" cy="22" rx="2" ry="0.9" fill="#ffaa00" opacity="1"/>
          <ellipse cx="32" cy="22" rx="1" ry="0.5" fill="#ffee44" opacity="1"/>
          <ellipse cx="32" cy="14" rx="5" ry="4" fill="#1a0800" opacity="0.5"/>
          <ellipse cx="29" cy="10" rx="4" ry="3.5" fill="#220a00" opacity="0.4"/>
          <ellipse cx="35" cy="9" rx="4" ry="3" fill="#1a0800" opacity="0.35"/>
          <ellipse cx="30" cy="6" rx="3" ry="2.5" fill="#110600" opacity="0.4"/>
          <ellipse cx="34" cy="5" rx="3" ry="2.5" fill="#110600" opacity="0.35"/>
          <circle cx="28" cy="12" r="1.5" fill="#ff5500" opacity="0.7"/>
          <circle cx="36" cy="10" r="1.2" fill="#ff6600" opacity="0.65"/>
          <circle cx="25" cy="8" r="1" fill="#ff4400" opacity="0.5"/>
          <circle cx="39" cy="7" r="0.8" fill="#ff7700" opacity="0.5"/>
          <circle cx="30" cy="4" r="0.7" fill="#ffaa00" opacity="0.4"/>
          <circle cx="34" cy="3" r="0.6" fill="#ff8800" opacity="0.4"/>
          <line x1="28" y1="12" x2="28" y2="16" stroke="#ff4400" stroke-width="0.8" opacity="0.4"/>
          <line x1="36" y1="10" x2="36" y2="14" stroke="#ff5500" stroke-width="0.8" opacity="0.35"/>
          <circle cx="18" cy="40" r="0.8" fill="#ff6600" opacity="0.5"/>
          <circle cx="46" cy="38" r="0.7" fill="#ff8800" opacity="0.45"/>
          <circle cx="14" cy="48" r="0.6" fill="#ff4400" opacity="0.4"/>
          <circle cx="50" cy="46" r="0.7" fill="#ff5500" opacity="0.4"/>
          <circle cx="22" cy="34" r="0.5" fill="#ffaa00" opacity="0.35"/>
          <circle cx="42" cy="32" r="0.5" fill="#ff9900" opacity="0.35"/>
          <ellipse cx="16" cy="50" rx="3" ry="1.5" fill="#240800" opacity="0.8"/>
          <ellipse cx="48" cy="48" rx="2.5" ry="1.2" fill="#240800" opacity="0.8"/>
          <ellipse cx="20" cy="44" rx="2" ry="1" fill="#1e0600" opacity="0.7"/>
          <ellipse cx="44" cy="42" rx="2" ry="1" fill="#1e0600" opacity="0.7"/>
          <ellipse cx="32" cy="2" rx="20" ry="6" fill="#cc1100" opacity="0.08"/>
        </svg>`,

      frozen: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
          <rect width="64" height="64" fill="#060e1a" rx="5"/>
          <ellipse cx="32" cy="0" rx="34" ry="12" fill="#0a2a44" opacity="0.6"/>
          <ellipse cx="20" cy="4" rx="18" ry="6" fill="#0a3322" opacity="0.3"/>
          <ellipse cx="46" cy="6" rx="14" ry="5" fill="#0a2233" opacity="0.25"/>
          <circle cx="8" cy="6" r="0.5" fill="#cceeff" opacity="0.8"/>
          <circle cx="18" cy="3" r="0.4" fill="#ddeeff" opacity="0.7"/>
          <circle cx="45" cy="4" r="0.5" fill="#cceeff" opacity="0.7"/>
          <circle cx="56" cy="8" r="0.4" fill="#ddeeff" opacity="0.6"/>
          <circle cx="60" cy="3" r="0.3" fill="#cceeff" opacity="0.6"/>
          <circle cx="4" cy="14" r="0.4" fill="#ddeeff" opacity="0.5"/>
          <circle cx="36" cy="2" r="0.3" fill="#cceeff" opacity="0.6"/>
          <ellipse cx="32" cy="62" rx="30" ry="8" fill="#0e2034" opacity="0.9"/>
          <ellipse cx="32" cy="63" rx="26" ry="5" fill="#152840" opacity="0.8"/>
          <ellipse cx="10" cy="60" rx="8" ry="3" fill="#1a3a55" opacity="0.6"/>
          <ellipse cx="54" cy="61" rx="7" ry="2.5" fill="#1a3a55" opacity="0.6"/>
          <rect x="2" y="28" width="10" height="28" fill="#0e2a42" rx="1"/>
          <polygon points="7,18 2,28 12,28" fill="#122e48"/>
          <polygon points="7,16 3,28 11,28" fill="#163454" opacity="0.8"/>
          <rect x="52" y="28" width="10" height="28" fill="#0e2a42" rx="1"/>
          <polygon points="57,18 52,28 62,28" fill="#122e48"/>
          <polygon points="57,16 53,28 61,28" fill="#163454" opacity="0.8"/>
          <rect x="4" y="32" width="4" height="5" fill="#4ab8ee" opacity="0.5" rx="1"/>
          <rect x="5" y="33" width="2" height="3" fill="#88ddff" opacity="0.4" rx="1"/>
          <rect x="56" y="32" width="4" height="5" fill="#4ab8ee" opacity="0.5" rx="1"/>
          <rect x="57" y="33" width="2" height="3" fill="#88ddff" opacity="0.4" rx="1"/>
          <rect x="12" y="26" width="40" height="32" fill="#0e2a42" rx="2"/>
          <rect x="13" y="28" width="8" height="3" fill="#122e48" rx="1" opacity="0.7"/>
          <rect x="23" y="28" width="8" height="3" fill="#122e48" rx="1" opacity="0.7"/>
          <rect x="33" y="28" width="8" height="3" fill="#122e48" rx="1" opacity="0.7"/>
          <rect x="43" y="28" width="8" height="3" fill="#122e48" rx="1" opacity="0.7"/>
          <rect x="13" y="33" width="6" height="3" fill="#122e48" rx="1" opacity="0.6"/>
          <rect x="21" y="33" width="9" height="3" fill="#122e48" rx="1" opacity="0.6"/>
          <rect x="32" y="33" width="7" height="3" fill="#122e48" rx="1" opacity="0.6"/>
          <rect x="41" y="33" width="9" height="3" fill="#122e48" rx="1" opacity="0.6"/>
          <rect x="8" y="16" width="14" height="26" fill="#112840" rx="2"/>
          <rect x="8" y="12" width="3" height="6" fill="#112840" rx="1"/>
          <rect x="13" y="12" width="3" height="6" fill="#112840" rx="1"/>
          <rect x="18" y="12" width="3" height="6" fill="#112840" rx="1"/>
          <rect x="9" y="18" width="5" height="2.5" fill="#163454" rx="1" opacity="0.7"/>
          <rect x="16" y="18" width="5" height="2.5" fill="#163454" rx="1" opacity="0.7"/>
          <rect x="10" y="23" width="6" height="2.5" fill="#163454" rx="1" opacity="0.6"/>
          <rect x="9" y="28" width="5" height="2.5" fill="#163454" rx="1" opacity="0.6"/>
          <rect x="16" y="28" width="4" height="2.5" fill="#163454" rx="1" opacity="0.6"/>
          <rect x="10" y="19" width="6" height="7" fill="#061020" rx="1"/>
          <rect x="11" y="20" width="4" height="5" fill="#44aadd" opacity="0.7" rx="1"/>
          <rect x="12" y="21" width="2" height="3" fill="#aaddff" opacity="0.5" rx="1"/>
          <rect x="42" y="16" width="14" height="26" fill="#112840" rx="2"/>
          <rect x="42" y="12" width="3" height="6" fill="#112840" rx="1"/>
          <rect x="47" y="12" width="3" height="6" fill="#112840" rx="1"/>
          <rect x="52" y="12" width="3" height="6" fill="#112840" rx="1"/>
          <rect x="43" y="18" width="5" height="2.5" fill="#163454" rx="1" opacity="0.7"/>
          <rect x="50" y="18" width="5" height="2.5" fill="#163454" rx="1" opacity="0.7"/>
          <rect x="44" y="23" width="6" height="2.5" fill="#163454" rx="1" opacity="0.6"/>
          <rect x="43" y="28" width="5" height="2.5" fill="#163454" rx="1" opacity="0.6"/>
          <rect x="50" y="28" width="4" height="2.5" fill="#163454" rx="1" opacity="0.6"/>
          <rect x="48" y="19" width="6" height="7" fill="#061020" rx="1"/>
          <rect x="49" y="20" width="4" height="5" fill="#44aadd" opacity="0.7" rx="1"/>
          <rect x="50" y="21" width="2" height="3" fill="#aaddff" opacity="0.5" rx="1"/>
          <rect x="13" y="22" width="4" height="6" fill="#0e2a42" rx="1"/>
          <rect x="19" y="22" width="4" height="6" fill="#0e2a42" rx="1"/>
          <rect x="41" y="22" width="4" height="6" fill="#0e2a42" rx="1"/>
          <rect x="47" y="22" width="4" height="6" fill="#0e2a42" rx="1"/>
          <rect x="26" y="18" width="12" height="22" fill="#112e4a" rx="2"/>
          <polygon points="32,4 26,18 38,18" fill="#163656"/>
          <polygon points="32,4 26,18 30,18" fill="#1e4466" opacity="0.5"/>
          <polygon points="32,2 30,8 34,8" fill="#88ddff" opacity="0.8"/>
          <polygon points="32,2 30,8 32,8" fill="#ccf0ff" opacity="0.5"/>
          <rect x="29" y="22" width="6" height="7" fill="#061018" rx="1"/>
          <rect x="30" y="23" width="4" height="5" fill="#55bbee" opacity="0.8" rx="1"/>
          <rect x="31" y="24" width="2" height="3" fill="#aaddff" opacity="0.6" rx="1"/>
          <rect x="27" y="40" width="10" height="18" fill="#06101c" rx="1"/>
          <ellipse cx="32" cy="40" rx="5" ry="4" fill="#06101c"/>
          <rect x="29" y="42" width="1" height="14" fill="#0e2034" rx="1"/>
          <rect x="32" y="42" width="1" height="14" fill="#0e2034" rx="1"/>
          <rect x="35" y="42" width="1" height="14" fill="#0e2034" rx="1"/>
          <rect x="28" y="48" width="8" height="1" fill="#0e2034" rx="1"/>
          <polygon points="14,28 15,34 16,28" fill="#88ccee" opacity="0.6"/>
          <polygon points="20,28 21,33 22,28" fill="#88ccee" opacity="0.6"/>
          <polygon points="42,28 43,32 44,28" fill="#88ccee" opacity="0.6"/>
          <polygon points="48,28 49,33 50,28" fill="#88ccee" opacity="0.6"/>
          <polygon points="9,42 10,48 11,42" fill="#66aacc" opacity="0.5"/>
          <polygon points="13,42 14,47 15,42" fill="#66aacc" opacity="0.5"/>
          <polygon points="49,42 50,47 51,42" fill="#66aacc" opacity="0.5"/>
          <polygon points="53,42 54,46 55,42" fill="#66aacc" opacity="0.5"/>
          <ellipse cx="15" cy="12" rx="7" ry="2" fill="#cce8f4" opacity="0.5"/>
          <ellipse cx="49" cy="12" rx="7" ry="2" fill="#cce8f4" opacity="0.5"/>
          <ellipse cx="32" cy="18" rx="7" ry="1.5" fill="#cce8f4" opacity="0.4"/>
          <circle cx="6" cy="36" r="0.8" fill="#aaddff" opacity="0.5"/>
          <circle cx="58" cy="40" r="0.7" fill="#bbeeFF" opacity="0.45"/>
          <circle cx="4" cy="50" r="0.6" fill="#99ccee" opacity="0.4"/>
          <circle cx="60" cy="52" r="0.8" fill="#aaddff" opacity="0.4"/>
          <circle cx="20" cy="8" r="0.5" fill="#cceeff" opacity="0.5"/>
          <circle cx="44" cy="10" r="0.4" fill="#bbddff" opacity="0.45"/>
          <line x1="32" y1="2" x2="32" y2="6" stroke="#88ddff" stroke-width="0.8" opacity="0.6"/>
          <line x1="30" y1="4" x2="34" y2="4" stroke="#88ddff" stroke-width="0.8" opacity="0.6"/>
          <line x1="30.5" y1="2.5" x2="33.5" y2="5.5" stroke="#88ddff" stroke-width="0.6" opacity="0.4"/>
          <line x1="33.5" y1="2.5" x2="30.5" y2="5.5" stroke="#88ddff" stroke-width="0.6" opacity="0.4"/>
        </svg>`,

      void: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect width="64" height="64" fill="#03000a" rx="6"/>
          
          <!-- Outer dark rings -->
          <circle cx="32" cy="32" r="29" fill="#07000f"/>
          <circle cx="32" cy="32" r="24" fill="#0d0018"/>
          <circle cx="32" cy="32" r="19" fill="#160025"/>
          
          <!-- Swirl arms -->
          <path d="M32 13 Q48 20 45 32 Q42 44 32 48 Q20 52 14 42 Q8 32 16 22 Q24 12 32 13"
            fill="none" stroke="#6600cc" stroke-width="1.2" opacity="0.5"/>
          <path d="M32 13 Q18 8 12 20 Q6 32 14 42 Q22 52 34 50 Q46 48 50 36 Q54 22 42 16 Q36 12 32 13"
            fill="none" stroke="#aa00ff" stroke-width="0.7" opacity="0.3"/>
            
          <!-- Inner glow layers -->
          <circle cx="32" cy="32" r="14" fill="#2200aa" opacity="0.35"/>
          <circle cx="32" cy="32" r="10" fill="#4400cc" opacity="0.4"/>
          <circle cx="32" cy="32" r="7"  fill="#7700ff" opacity="0.5"/>
          <circle cx="32" cy="32" r="4"  fill="#bb44ff" opacity="0.8"/>
          <circle cx="32" cy="32" r="2"  fill="#ee88ff" opacity="0.95"/>
          <circle cx="32" cy="32" r="1"  fill="#ffffff" opacity="0.8"/>
          
          <!-- Cross beams -->
          <line x1="6"  y1="32" x2="58" y2="32" stroke="#bb00ff" stroke-width="0.9" opacity="0.4"/>
          <line x1="32" y1="6"  x2="32" y2="58" stroke="#bb00ff" stroke-width="0.9" opacity="0.4"/>
          <line x1="12" y1="12" x2="52" y2="52" stroke="#8800dd" stroke-width="0.6" opacity="0.3"/>
          <line x1="52" y1="12" x2="12" y2="52" stroke="#8800dd" stroke-width="0.6" opacity="0.3"/>
          
          <!-- Orbiting particles -->
          <circle cx="32" cy="8"  r="2"   fill="#ff44ff" opacity="0.8"/>
          <circle cx="32" cy="8"  r="1"   fill="#ffffff" opacity="0.6"/>
          <circle cx="56" cy="32" r="1.8" fill="#dd00ff" opacity="0.75"/>
          <circle cx="56" cy="32" r="0.8" fill="#ffffff" opacity="0.5"/>
          <circle cx="32" cy="56" r="1.5" fill="#ff44ff" opacity="0.7"/>
          <circle cx="8"  cy="32" r="1.8" fill="#cc00ee" opacity="0.7"/>
          
          <!-- Corner stars -->
          <circle cx="10" cy="10" r="1.2" fill="#ff44ff" opacity="0.6"/>
          <circle cx="54" cy="10" r="1"   fill="#cc88ff" opacity="0.5"/>
          <circle cx="10" cy="54" r="1"   fill="#ff88ff" opacity="0.45"/>
          <circle cx="54" cy="54" r="1.2" fill="#ee44ff" opacity="0.55"/>
          
          <!-- Tiny floating particles -->
          <circle cx="20" cy="16" r="0.8" fill="#ff00ff" opacity="0.4"/>
          <circle cx="44" cy="14" r="0.7" fill="#dd44ff" opacity="0.35"/>
          <circle cx="14" cy="42" r="0.8" fill="#ff44ff" opacity="0.4"/>
          <circle cx="50" cy="46" r="0.7" fill="#cc88ff" opacity="0.35"/>
          <circle cx="48" cy="22" r="0.6" fill="#ff00ff" opacity="0.3"/>
          <circle cx="16" cy="24" r="0.6" fill="#ee66ff" opacity="0.3"/>
          
          <!-- Outer ring glow -->
          <circle cx="32" cy="32" r="28" fill="none" stroke="#6600aa" stroke-width="1" opacity="0.4"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="#9900cc" stroke-width="0.6" opacity="0.3"/>
        </svg>`,

      poison: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <rect width="64" height="64" fill="#040e02" rx="6"/>

          <!-- Σκιά στο έδαφος -->
          <ellipse cx="32" cy="61" rx="18" ry="3" fill="#000000" opacity="0.5"/>

          <!-- Τρίποδα πόδια -->
          <path d="M26 50 L20 62" stroke="#1a3a08" stroke-width="3" stroke-linecap="round"/>
          <path d="M38 50 L44 62" stroke="#1a3a08" stroke-width="3" stroke-linecap="round"/>
          <path d="M32 52 L32 62" stroke="#1a3a08" stroke-width="3" stroke-linecap="round"/>
          <!-- Πόδια highlight -->
          <path d="M26 50 L20 62" stroke="#2a5a10" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
          <path d="M38 50 L44 62" stroke="#2a5a10" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
          <path d="M32 52 L32 62" stroke="#2a5a10" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>

          <!-- Καζάνι εξωτερικό -->
          <ellipse cx="32" cy="48" rx="16" ry="5" fill="#0f2206"/>
          <path d="M16 34 Q14 48 16 50 Q24 56 32 56 Q40 56 48 50 Q50 48 48 34 Z" fill="#0f2206"/>
          <path d="M16 34 Q14 48 16 50 Q24 56 32 56 Q40 56 48 50 Q50 48 48 34 Z" fill="url(#cauldron_side)"/>

          <!-- Καζάνι εσωτερικό σκιά -->
          <path d="M18 35 Q16 47 18 49 Q25 54 32 54 Q39 54 46 49 Q48 47 46 35 Z" fill="#122608"/>

          <!-- Rim του καζάνι - πάνω μέρος -->
          <ellipse cx="32" cy="34" rx="16" ry="5.5" fill="#1a3a0a"/>
          <ellipse cx="32" cy="33" rx="15" ry="5" fill="#224e0e"/>
          <ellipse cx="32" cy="32.5" rx="14" ry="4.5" fill="#2a6012"/>
          <!-- Rim highlight -->
          <ellipse cx="32" cy="31.5" rx="12" ry="3" fill="none" stroke="#44aa18" stroke-width="0.8" opacity="0.7"/>

          <!-- Liquid surface -->
          <ellipse cx="32" cy="31" rx="13" ry="4" fill="#1a5008"/>
          <ellipse cx="32" cy="30.5" rx="12" ry="3.5" fill="#226610"/>
          <ellipse cx="32" cy="30" rx="10" ry="3" fill="#2a8814"/>
          <ellipse cx="32" cy="29.5" rx="8" ry="2.5" fill="#33aa18"/>
          <!-- Liquid shimmer -->
          <ellipse cx="28" cy="29" rx="4" ry="1.2" fill="#55cc22" opacity="0.5"/>
          <ellipse cx="38" cy="30" rx="2.5" ry="0.8" fill="#66dd22" opacity="0.4"/>

          <!-- Bubbles στο liquid -->
          <circle cx="24" cy="29" r="2.5" fill="#33aa10" opacity="0.0"/>
          <circle cx="24" cy="28" r="2.2" fill="#33bb10" opacity="0.8"/>
          <circle cx="24" cy="28" r="1.2" fill="#88ff44" opacity="0.9"/>
          <circle cx="24" cy="28" r="0.5" fill="#ffffff" opacity="0.6"/>

          <circle cx="40" cy="27" r="1.8" fill="#33aa10" opacity="0.8"/>
          <circle cx="40" cy="27" r="0.9" fill="#88ff44" opacity="0.9"/>
          <circle cx="40" cy="27" r="0.4" fill="#ffffff" opacity="0.5"/>

          <circle cx="32" cy="26" r="3" fill="#33aa10" opacity="0.75"/>
          <circle cx="32" cy="26" r="1.6" fill="#99ff44" opacity="0.9"/>
          <circle cx="32" cy="26" r="0.7" fill="#ffffff" opacity="0.6"/>

          <!-- Μικρές φουσκάλες -->
          <circle cx="28" cy="31" r="1" fill="#55cc22" opacity="0.6"/>
          <circle cx="36" cy="32" r="0.8" fill="#55cc22" opacity="0.5"/>
          <circle cx="22" cy="30" r="0.7" fill="#44bb18" opacity="0.5"/>

          <!-- Skull στο πλάι του καζάνι -->
          <circle cx="32" cy="44" r="5.5" fill="#0a1a04" opacity="0.8"/>
          <circle cx="32" cy="44" r="4.5" fill="#0d2006" opacity="0.6"/>
          <!-- Skull eyes -->
          <ellipse cx="29.5" cy="43" rx="1.8" ry="2" fill="#44ff22" opacity="0.7"/>
          <ellipse cx="34.5" cy="43" rx="1.8" ry="2" fill="#44ff22" opacity="0.7"/>
          <ellipse cx="29.5" cy="43" rx="0.8" ry="0.9" fill="#88ff44" opacity="0.9"/>
          <ellipse cx="34.5" cy="43" rx="0.8" ry="0.9" fill="#88ff44" opacity="0.9"/>
          <!-- Skull teeth -->
          <rect x="29" y="46.5" width="2" height="2.5" fill="#33cc10" opacity="0.6" rx="0.5"/>
          <rect x="32" y="46.5" width="2" height="2.5" fill="#33cc10" opacity="0.6" rx="0.5"/>
          <rect x="27.5" y="46.5" width="1.2" height="2" fill="#22aa08" opacity="0.5" rx="0.5"/>
          <rect x="34.3" y="46.5" width="1.2" height="2" fill="#22aa08" opacity="0.5" rx="0.5"/>

          <!-- Ατμός αέριο που ανεβαίνει -->
          <ellipse cx="22" cy="22" rx="3.5" ry="5.5" fill="#33cc10" opacity="0.15"/>
          <ellipse cx="22" cy="16" rx="2.5" ry="4"   fill="#44dd10" opacity="0.12"/>
          <ellipse cx="22" cy="10" rx="2"   ry="3"   fill="#55ee10" opacity="0.08"/>

          <ellipse cx="32" cy="20" rx="4" ry="6"   fill="#33cc10" opacity="0.18"/>
          <ellipse cx="32" cy="13" rx="3" ry="4.5" fill="#44dd10" opacity="0.14"/>
          <ellipse cx="32" cy="7"  rx="2" ry="3"   fill="#55ee10" opacity="0.09"/>

          <ellipse cx="42" cy="22" rx="3.5" ry="5.5" fill="#33cc10" opacity="0.15"/>
          <ellipse cx="42" cy="16" rx="2.5" ry="4"   fill="#44dd10" opacity="0.12"/>
          <ellipse cx="42" cy="10" rx="2"   ry="3"   fill="#55ee10" opacity="0.08"/>

          <!-- Σταγόνες που πέφτουν -->
          <ellipse cx="18" cy="12" rx="1.5" ry="2" fill="#66ff22" opacity="0.45"/>
          <ellipse cx="46" cy="10" rx="1.2" ry="1.8" fill="#66ff22" opacity="0.4"/>
          <circle  cx="32" cy="5"  r="2"             fill="#88ff44" opacity="0.35"/>
          <circle  cx="24" cy="8"  r="1.3"           fill="#77ee33" opacity="0.3"/>
          <circle  cx="40" cy="7"  r="1.5"           fill="#77ee33" opacity="0.3"/>

          <!-- Glow halo γύρω από το rim -->
          <ellipse cx="32" cy="31" rx="17" ry="6" fill="none" stroke="#44cc10" stroke-width="0.8" opacity="0.4"/>
          <ellipse cx="32" cy="31" rx="19" ry="7" fill="none" stroke="#33aa08" stroke-width="0.5" opacity="0.2"/>

          <!-- Ambient glow -->
          <ellipse cx="32" cy="35" rx="20" ry="15" fill="#22ff00" opacity="0.03"/>

          <defs>
            <linearGradient id="cauldron_side" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stop-color="#1a4008" stop-opacity="0.8"/>
              <stop offset="30%"  stop-color="#2a6012" stop-opacity="0.4"/>
              <stop offset="70%"  stop-color="#2a6012" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#1a4008" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
        </svg>`,
    };

    Object.entries(bases).forEach(([world, svg]) => {
      scene.textures.addBase64(`base_${world}`, 'data:image/svg+xml;base64,' + this.svgToBase64(svg));
    });

    const locked = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <rect width="64" height="64" fill="#080808" rx="6"/>

        <!-- Outer frame -->
        <rect x="4" y="4" width="56" height="56" fill="#111111" rx="8" stroke="#1a1a1a" stroke-width="1"/>

        <!-- Stone texture panels -->
        <rect x="6" y="6" width="24" height="24" fill="#131313" rx="3" opacity="0.8"/>
        <rect x="34" y="6" width="24" height="24" fill="#121212" rx="3" opacity="0.8"/>
        <rect x="6" y="34" width="24" height="24" fill="#121212" rx="3" opacity="0.8"/>
        <rect x="34" y="34" width="24" height="24" fill="#131313" rx="3" opacity="0.8"/>

        <!-- Inner glow border -->
        <rect x="8" y="8" width="48" height="48" fill="none" rx="6"
          stroke="#2a2a2a" stroke-width="1.5"/>
        <rect x="10" y="10" width="44" height="44" fill="none" rx="5"
          stroke="#1e1e1e" stroke-width="0.8"/>

        <!-- Corner ornaments -->
        <circle cx="12" cy="12" r="3" fill="#1a1a1a" stroke="#333" stroke-width="0.8"/>
        <circle cx="12" cy="12" r="1.5" fill="#222"/>
        <circle cx="52" cy="12" r="3" fill="#1a1a1a" stroke="#333" stroke-width="0.8"/>
        <circle cx="52" cy="12" r="1.5" fill="#222"/>
        <circle cx="12" cy="52" r="3" fill="#1a1a1a" stroke="#333" stroke-width="0.8"/>
        <circle cx="12" cy="52" r="1.5" fill="#222"/>
        <circle cx="52" cy="52" r="3" fill="#1a1a1a" stroke="#333" stroke-width="0.8"/>
        <circle cx="52" cy="52" r="1.5" fill="#222"/>

        <!-- Corner cross details -->
        <line x1="12" y1="7" x2="12" y2="10" stroke="#333" stroke-width="0.8"/>
        <line x1="9"  y1="12" x2="7" y2="12" stroke="#333" stroke-width="0.8"/>
        <line x1="52" y1="7" x2="52" y2="10" stroke="#333" stroke-width="0.8"/>
        <line x1="55" y1="12" x2="57" y2="12" stroke="#333" stroke-width="0.8"/>
        <line x1="12" y1="57" x2="12" y2="54" stroke="#333" stroke-width="0.8"/>
        <line x1="9"  y1="52" x2="7" y2="52" stroke="#333" stroke-width="0.8"/>
        <line x1="52" y1="57" x2="52" y2="54" stroke="#333" stroke-width="0.8"/>
        <line x1="55" y1="52" x2="57" y2="52" stroke="#333" stroke-width="0.8"/>

        <!-- Lock body -->
        <rect x="18" y="32" width="28" height="22" fill="#252525" rx="5"
          stroke="#333" stroke-width="1"/>
        <rect x="19" y="33" width="26" height="20" fill="#202020" rx="4"/>
        <!-- Lock body highlight -->
        <rect x="20" y="33" width="24" height="4" fill="#2a2a2a" rx="3" opacity="0.6"/>
        <!-- Lock body rivets -->
        <circle cx="22" cy="35" r="1.2" fill="#2e2e2e" stroke="#3a3a3a" stroke-width="0.5"/>
        <circle cx="42" cy="35" r="1.2" fill="#2e2e2e" stroke="#3a3a3a" stroke-width="0.5"/>
        <circle cx="22" cy="50" r="1.2" fill="#2e2e2e" stroke="#3a3a3a" stroke-width="0.5"/>
        <circle cx="42" cy="50" r="1.2" fill="#2e2e2e" stroke="#3a3a3a" stroke-width="0.5"/>

        <!-- Shackle outer -->
        <path d="M22 33 Q22 18 32 18 Q42 18 42 33"
          stroke="#2e2e2e" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Shackle inner -->
        <path d="M22 33 Q22 18 32 18 Q42 18 42 33"
          stroke="#3d3d3d" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Shackle highlight -->
        <path d="M23 33 Q23 20 32 20 Q41 20 41 33"
          stroke="#484848" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>

        <!-- Keyhole outer -->
        <circle cx="32" cy="40" r="5.5" fill="#161616" stroke="#2a2a2a" stroke-width="0.8"/>
        <circle cx="32" cy="40" r="4"   fill="#111111"/>
        <!-- Keyhole circle -->
        <circle cx="32" cy="38.5" r="2.5" fill="#1a1a1a" stroke="#2e2e2e" stroke-width="0.6"/>
        <circle cx="32" cy="38.5" r="1.5" fill="#0a0a0a"/>
        <!-- Keyhole slot -->
        <rect x="30.5" y="40" width="3" height="6" fill="#1a1a1a" rx="1"/>
        <rect x="31" y="40" width="2" height="5" fill="#0d0d0d" rx="0.5"/>

        <!-- Subtle red glow on keyhole -->
        <circle cx="32" cy="38.5" r="3.5" fill="#ff0000" opacity="0.04"/>
        <circle cx="32" cy="40" r="6" fill="#aa0000" opacity="0.03"/>

        <!-- Center decorative lines -->
        <line x1="16" y1="32" x2="19" y2="32" stroke="#2a2a2a" stroke-width="0.8"/>
        <line x1="45" y1="32" x2="48" y2="32" stroke="#2a2a2a" stroke-width="0.8"/>

        <!-- Subtle vignette glow -->
        <rect x="4" y="4" width="56" height="56" rx="8"
          fill="none" stroke="#1f1f1f" stroke-width="2" opacity="0.5"/>
      </svg>`;
    scene.textures.addBase64('base_locked', 'data:image/svg+xml;base64,' + this.svgToBase64(locked));
  }

  // ── TOWERS ────────────────────────────────────────────
  static createTowerTextures(scene) {
    const towers = {
      // DUNGEON
      fire_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Base/foundation -->
          <rect x="10" y="38" width="28" height="8" fill="#1a0400" rx="1"/>
          <rect x="8"  y="36" width="32" height="4" fill="#220600" rx="1"/>

          <!-- Main tower body -->
          <rect x="10" y="16" width="28" height="22" fill="#1e0500" rx="1"/>
          <!-- Body detail lines -->
          <rect x="10" y="20" width="28" height="1.5" fill="#2a0700" opacity="0.8"/>
          <rect x="10" y="26" width="28" height="1.5" fill="#2a0700" opacity="0.8"/>
          <rect x="10" y="32" width="28" height="1.5" fill="#2a0700" opacity="0.8"/>
          <!-- Vertical cracks -->
          <line x1="19" y1="16" x2="19" y2="38" stroke="#110300" stroke-width="0.8" opacity="0.6"/>
          <line x1="29" y1="16" x2="29" y2="38" stroke="#110300" stroke-width="0.8" opacity="0.6"/>

          <!-- Side towers -->
          <rect x="4"  y="14" width="9" height="22" fill="#240700" rx="1"/>
          <rect x="35" y="14" width="9" height="22" fill="#240700" rx="1"/>
          <!-- Side tower details -->
          <rect x="5"  y="18" width="7" height="1" fill="#300900" opacity="0.7"/>
          <rect x="5"  y="24" width="7" height="1" fill="#300900" opacity="0.7"/>
          <rect x="5"  y="30" width="7" height="1" fill="#300900" opacity="0.7"/>
          <rect x="36" y="18" width="7" height="1" fill="#300900" opacity="0.7"/>
          <rect x="36" y="24" width="7" height="1" fill="#300900" opacity="0.7"/>
          <rect x="36" y="30" width="7" height="1" fill="#300900" opacity="0.7"/>

          <!-- Battlements center -->
          <rect x="12" y="10" width="6" height="8" fill="#220600" rx="1"/>
          <rect x="21" y="10" width="6" height="8" fill="#220600" rx="1"/>
          <rect x="30" y="10" width="6" height="8" fill="#220600" rx="1"/>
          <!-- Battlement gaps (dark) -->
          <rect x="18" y="10" width="3" height="6" fill="#0f0200"/>
          <rect x="27" y="10" width="3" height="6" fill="#0f0200"/>
          <!-- Battlement tops -->
          <rect x="12" y="9"  width="6" height="2" fill="#2e0800" rx="0.5"/>
          <rect x="21" y="9"  width="6" height="2" fill="#2e0800" rx="0.5"/>
          <rect x="30" y="9"  width="6" height="2" fill="#2e0800" rx="0.5"/>

          <!-- Side battlements -->
          <rect x="4"  y="10" width="4" height="6" fill="#200600" rx="1"/>
          <rect x="35" y="10" width="4" height="6" fill="#200600" rx="1"/>
          <rect x="8"  y="10" width="3" height="4" fill="#200600" rx="1"/>
          <rect x="39" y="10" width="3" height="4" fill="#200600" rx="1"/>

          <!-- Windows - glowing orange -->
          <rect x="13" y="22" width="5" height="7" fill="#0f0100" rx="1"/>
          <rect x="30" y="22" width="5" height="7" fill="#0f0100" rx="1"/>
          <rect x="13" y="22" width="5" height="7" fill="#ff4400" opacity="0.35" rx="1"/>
          <rect x="30" y="22" width="5" height="7" fill="#ff4400" opacity="0.35" rx="1"/>
          <!-- Window glow -->
          <rect x="14" y="23" width="3" height="5" fill="#ff6600" opacity="0.5" rx="0.5"/>
          <rect x="31" y="23" width="3" height="5" fill="#ff6600" opacity="0.5" rx="0.5"/>
          <!-- Window inner bright -->
          <rect x="15" y="24" width="1.5" height="3" fill="#ffaa00" opacity="0.7" rx="0.5"/>
          <rect x="32" y="24" width="1.5" height="3" fill="#ffaa00" opacity="0.7" rx="0.5"/>

          <!-- Door arch -->
          <rect x="20" y="28" width="8" height="10" fill="#0f0100" rx="1"/>
          <path d="M20 31 Q24 26 28 31" fill="#0f0100"/>
          <!-- Door glow -->
          <rect x="21" y="29" width="6" height="9" fill="#cc2200" opacity="0.2" rx="0.5"/>

          <!-- FIRE on top - multi layer -->
          <!-- Outer fire glow -->
          <ellipse cx="24" cy="10" rx="10" ry="7" fill="#ff2200" opacity="0.15"/>
          <!-- Base flame -->
          <path d="M15 12 Q18 4 24 2 Q30 4 33 12 Q30 8 27 11 Q24 6 21 11 Q18 8 15 12"
            fill="#cc2200" opacity="0.8"/>
          <!-- Mid flame -->
          <path d="M17 12 Q20 5 24 3 Q28 5 31 12 Q28 8 26 10 Q24 7 22 10 Q20 8 17 12"
            fill="#ff4400" opacity="0.9"/>
          <!-- Inner flame -->
          <path d="M19 12 Q21 6 24 4 Q27 6 29 12 Q27 9 25.5 11 Q24 8 22.5 11 Q21 9 19 12"
            fill="#ff7700"/>
          <!-- Core flame -->
          <ellipse cx="24" cy="9" rx="3.5" ry="4" fill="#ffaa00"/>
          <ellipse cx="24" cy="8" rx="2" ry="2.5" fill="#ffdd00"/>
          <ellipse cx="24" cy="7" rx="1" ry="1.5" fill="#ffffff" opacity="0.8"/>

          <!-- Ember particles -->
          <circle cx="18" cy="6"  r="0.8" fill="#ff4400" opacity="0.7"/>
          <circle cx="30" cy="5"  r="0.6" fill="#ff6600" opacity="0.6"/>
          <circle cx="20" cy="3"  r="0.5" fill="#ffaa00" opacity="0.5"/>
          <circle cx="28" cy="4"  r="0.7" fill="#ff4400" opacity="0.6"/>
          <circle cx="15" cy="8"  r="0.5" fill="#ff2200" opacity="0.5"/>
          <circle cx="33" cy="7"  r="0.6" fill="#ff3300" opacity="0.5"/>

          <!-- Lava drips on side windows -->
          <rect x="6"  y="28" width="2" height="4" fill="#ff3300" opacity="0.3" rx="1"/>
          <rect x="40" y="28" width="2" height="4" fill="#ff3300" opacity="0.3" rx="1"/>

          <!-- Ground shadow -->
          <ellipse cx="24" cy="44" rx="14" ry="2" fill="#000000" opacity="0.4"/>
        </svg>`,

      ice_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Base structure -->
          <rect x="8" y="16" width="32" height="28" fill="#04101e" rx="2"/>
          <rect x="4" y="12" width="10" height="18" fill="#061528" rx="1"/>
          <rect x="34" y="12" width="10" height="18" fill="#061528" rx="1"/>
          <rect x="14" y="7" width="9" height="12" fill="#061528"/>
          <rect x="25" y="7" width="9" height="12" fill="#061528"/>
          <!-- Battlements -->
          <rect x="5" y="10" width="3" height="5" fill="#030e1a"/>
          <rect x="9" y="10" width="3" height="5" fill="#030e1a"/>
          <rect x="35" y="10" width="3" height="5" fill="#030e1a"/>
          <rect x="39" y="10" width="3" height="5" fill="#030e1a"/>
          <rect x="15" y="5" width="3" height="5" fill="#030e1a"/>
          <rect x="19" y="5" width="3" height="5" fill="#030e1a"/>
          <rect x="26" y="5" width="3" height="5" fill="#030e1a"/>
          <rect x="30" y="5" width="3" height="5" fill="#030e1a"/>
          <!-- Windows -->
          <rect x="14" y="21" width="7" height="9" fill="#020c16"/>
          <rect x="27" y="21" width="7" height="9" fill="#020c16"/>
          <!-- Window ice glow -->
          <rect x="15" y="22" width="5" height="7" fill="#0044aa" opacity="0.6"/>
          <rect x="28" y="22" width="5" height="7" fill="#0044aa" opacity="0.6"/>
          <rect x="16" y="23" width="3" height="5" fill="#22aaff" opacity="0.5"/>
          <rect x="29" y="23" width="3" height="5" fill="#22aaff" opacity="0.5"/>
          <!-- Door -->
          <rect x="20" y="28" width="8" height="16" fill="#020c16"/>
          <rect x="21" y="29" width="6" height="10" fill="#0033aa" opacity="0.4"/>
          <!-- Large ice crystal centerpiece -->
          <polygon points="24,6 27,14 24,12 21,14" fill="#aaddff" opacity="0.9"/>
          <polygon points="24,6 27,14 24,10 21,14" fill="#ffffff" opacity="0.5"/>
          <polygon points="24,18 26,24 24,22 22,24" fill="#88ccff" opacity="0.8"/>
          <polygon points="24,18 26,24 24,21 22,24" fill="#cceeff" opacity="0.5"/>
          <!-- Side icicles on towers -->
          <polygon points="6,12 7.5,7 9,12" fill="#aaddff" opacity="0.85"/>
          <polygon points="7.5,12 8.5,8 9.5,12" fill="#cceeff" opacity="0.6"/>
          <polygon points="36,12 37.5,7 39,12" fill="#aaddff" opacity="0.85"/>
          <polygon points="37.5,12 38.5,8 39.5,12" fill="#cceeff" opacity="0.6"/>
          <polygon points="16,7 17,3 18,7" fill="#aaddff" opacity="0.8"/>
          <polygon points="27,7 28,3 29,7" fill="#aaddff" opacity="0.8"/>
          <polygon points="20,7 21,4 22,7" fill="#88ccff" opacity="0.6"/>
          <polygon points="31,7 32,4 33,7" fill="#88ccff" opacity="0.6"/>
          <!-- Frost cracks on walls -->
          <path d="M10 20 L13 24 L11 28" stroke="#44aaff" stroke-width="0.7" fill="none" opacity="0.5"/>
          <path d="M38 20 L35 25 L37 30" stroke="#44aaff" stroke-width="0.7" fill="none" opacity="0.5"/>
          <path d="M12 34 L16 30 L14 38" stroke="#44aaff" stroke-width="0.6" fill="none" opacity="0.4"/>
          <!-- Ice orb -->
          <circle cx="24" cy="22" r="6" fill="#003388" opacity="0.5"/>
          <circle cx="24" cy="22" r="4" fill="#0055cc" opacity="0.6"/>
          <circle cx="24" cy="22" r="2.5" fill="#44aaff" opacity="0.8"/>
          <circle cx="24" cy="22" r="1" fill="#ffffff" opacity="0.9"/>
          <circle cx="22.5" cy="20.5" r="0.8" fill="#ffffff" opacity="0.7"/>
          <!-- Snowflake overlay on orb -->
          <line x1="24" y1="17" x2="24" y2="27" stroke="#cceeff" stroke-width="0.8" opacity="0.5"/>
          <line x1="19" y1="22" x2="29" y2="22" stroke="#cceeff" stroke-width="0.8" opacity="0.5"/>
          <line x1="20.5" y1="18.5" x2="27.5" y2="25.5" stroke="#cceeff" stroke-width="0.6" opacity="0.4"/>
          <line x1="27.5" y1="18.5" x2="20.5" y2="25.5" stroke="#cceeff" stroke-width="0.6" opacity="0.4"/>
          <!-- Base ice drips -->
          <polygon points="12,44 13.5,40 15,44" fill="#88ccff" opacity="0.4"/>
          <polygon points="22,44 23,41 24,44" fill="#88ccff" opacity="0.35"/>
          <polygon points="33,44 34.5,40 36,44" fill="#88ccff" opacity="0.4"/>
        </svg>`,

      arcane_dungeon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Base structure -->
          <rect x="8" y="16" width="32" height="28" fill="#0c0618" rx="2"/>
          <rect x="4" y="12" width="10" height="18" fill="#120820" rx="1"/>
          <rect x="34" y="12" width="10" height="18" fill="#120820" rx="1"/>
          <rect x="14" y="7" width="9" height="12" fill="#120820"/>
          <rect x="25" y="7" width="9" height="12" fill="#120820"/>
          <!-- Battlements -->
          <rect x="5" y="10" width="3" height="5" fill="#080412"/>
          <rect x="9" y="10" width="3" height="5" fill="#080412"/>
          <rect x="35" y="10" width="3" height="5" fill="#080412"/>
          <rect x="39" y="10" width="3" height="5" fill="#080412"/>
          <rect x="15" y="5" width="3" height="5" fill="#080412"/>
          <rect x="19" y="5" width="3" height="5" fill="#080412"/>
          <rect x="26" y="5" width="3" height="5" fill="#080412"/>
          <rect x="30" y="5" width="3" height="5" fill="#080412"/>
          <!-- Glowing windows -->
          <rect x="14" y="21" width="7" height="9" fill="#080412"/>
          <rect x="27" y="21" width="7" height="9" fill="#080412"/>
          <rect x="15" y="22" width="5" height="7" fill="#6600cc" opacity="0.7"/>
          <rect x="28" y="22" width="5" height="7" fill="#6600cc" opacity="0.7"/>
          <rect x="16" y="23" width="3" height="5" fill="#cc44ff" opacity="0.5"/>
          <rect x="29" y="23" width="3" height="5" fill="#cc44ff" opacity="0.5"/>
          <!-- Door with arcane seal -->
          <rect x="20" y="28" width="8" height="16" fill="#080412"/>
          <rect x="21" y="29" width="6" height="10" fill="#4400aa" opacity="0.4"/>
          <circle cx="24" cy="34" r="2" fill="#9933cc" opacity="0.6"/>
          <circle cx="24" cy="34" r="1" fill="#dd88ff" opacity="0.7"/>
          <!-- Arcane runes on walls -->
          <path d="M10 18 L12 22 L10 26" stroke="#8800cc" stroke-width="0.8" fill="none" opacity="0.6"/>
          <path d="M38 18 L36 22 L38 26" stroke="#8800cc" stroke-width="0.8" fill="none" opacity="0.6"/>
          <path d="M11 30 L13 27 L15 30 L13 33 Z" stroke="#6600aa" stroke-width="0.7" fill="none" opacity="0.5"/>
          <path d="M37 30 L35 27 L33 30 L35 33 Z" stroke="#6600aa" stroke-width="0.7" fill="none" opacity="0.5"/>
          <!-- Floating crystal spires on top -->
          <polygon points="17,7 18.5,1 20,7" fill="#9933cc" opacity="0.9"/>
          <polygon points="18,7 18.5,2 19,7" fill="#dd88ff" opacity="0.6"/>
          <polygon points="28,7 29.5,1 31,7" fill="#9933cc" opacity="0.9"/>
          <polygon points="29,7 29.5,2 30,7" fill="#dd88ff" opacity="0.6"/>
          <polygon points="6,12 7,7 8,12" fill="#7700bb" opacity="0.8"/>
          <polygon points="37,12 38,7 39,12" fill="#7700bb" opacity="0.8"/>
          <!-- Large arcane sigil / star -->
          <polygon points="24,8 25.8,14 32,14 26.9,17.8 28.7,24 24,20.2 19.3,24 21.1,17.8 16,14 22.2,14" fill="#cc44ff" opacity="0.9"/>
          <polygon points="24,10 25.4,14.8 30.5,14.8 26.3,17.8 27.8,23 24,20 20.2,23 21.7,17.8 17.5,14.8 22.6,14.8" fill="#440088" opacity="0.6"/>
          <!-- Orb center -->
          <circle cx="24" cy="18" r="5" fill="#4400aa" opacity="0.5"/>
          <circle cx="24" cy="18" r="3" fill="#8800dd" opacity="0.7"/>
          <circle cx="24" cy="18" r="1.5" fill="#cc66ff" opacity="0.9"/>
          <circle cx="24" cy="18" r="0.7" fill="#ffffff" opacity="0.9"/>
          <circle cx="22.8" cy="16.8" r="0.6" fill="#ffffff" opacity="0.6"/>
          <!-- Orbiting particles -->
          <circle cx="19" cy="15" r="1.2" fill="#aa33ff" opacity="0.7"/>
          <circle cx="29" cy="15" r="1.2" fill="#aa33ff" opacity="0.7"/>
          <circle cx="20" cy="24" r="1" fill="#cc55ff" opacity="0.6"/>
          <circle cx="28" cy="24" r="1" fill="#cc55ff" opacity="0.6"/>
          <!-- Purple mist at base -->
          <ellipse cx="14" cy="44" rx="4" ry="1.5" fill="#5500aa" opacity="0.3"/>
          <ellipse cx="34" cy="44" rx="4" ry="1.5" fill="#5500aa" opacity="0.3"/>
          <ellipse cx="24" cy="44" rx="5" ry="1.5" fill="#7700cc" opacity="0.25"/>
          <!-- Wall cracks with purple glow -->
          <path d="M9 32 L12 28 L10 36" stroke="#9900ff" stroke-width="0.6" fill="none" opacity="0.4"/>
          <path d="M39 32 L36 28 L38 36" stroke="#9900ff" stroke-width="0.6" fill="none" opacity="0.4"/>
        </svg>`,

      // FOREST
      fire_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Roots -->
          <path d="M20 44 Q16 40 14 44" stroke="#2a1804" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M28 44 Q32 40 34 44" stroke="#2a1804" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M22 44 Q18 38 15 40" stroke="#2a1804" stroke-width="1" fill="none" opacity="0.5"/>
          <path d="M26 44 Q30 38 33 40" stroke="#2a1804" stroke-width="1" fill="none" opacity="0.5"/>
          <!-- Trunk -->
          <rect x="20" y="28" width="8" height="16" fill="#3d2506" rx="1"/>
          <rect x="21" y="28" width="2" height="16" fill="#2a1804" opacity="0.6"/>
          <rect x="25" y="28" width="2" height="16" fill="#2a1804" opacity="0.4"/>
          <!-- Bark texture -->
          <path d="M22 30 Q21 34 22 38" stroke="#2a1804" stroke-width="0.7" fill="none" opacity="0.5"/>
          <path d="M26 32 Q27 36 26 40" stroke="#2a1804" stroke-width="0.7" fill="none" opacity="0.4"/>
          <!-- Outer dark canopy -->
          <ellipse cx="24" cy="26" rx="16" ry="14" fill="#121f04"/>
          <ellipse cx="16" cy="28" rx="8" ry="7" fill="#0f1a03"/>
          <ellipse cx="32" cy="28" rx="8" ry="7" fill="#0f1a03"/>
          <!-- Mid canopy layers -->
          <ellipse cx="24" cy="22" rx="13" ry="11" fill="#1a3205"/>
          <ellipse cx="18" cy="24" rx="7" ry="6" fill="#162c04"/>
          <ellipse cx="30" cy="24" rx="7" ry="6" fill="#162c04"/>
          <!-- Upper canopy -->
          <ellipse cx="24" cy="17" rx="10" ry="9" fill="#224408"/>
          <ellipse cx="24" cy="13" rx="7" ry="6" fill="#2d5c0a"/>
          <!-- Scorched/burnt patches on canopy -->
          <ellipse cx="17" cy="22" rx="4" ry="3" fill="#0a1002" opacity="0.8"/>
          <ellipse cx="31" cy="24" rx="3" ry="2.5" fill="#0a1002" opacity="0.7"/>
          <ellipse cx="24" cy="26" rx="3" ry="2" fill="#0a1002" opacity="0.6"/>
          <!-- Fire emerging from canopy -->
          <ellipse cx="20" cy="20" rx="5" ry="6" fill="#cc2200" opacity="0.7"/>
          <ellipse cx="28" cy="19" rx="4" ry="5" fill="#bb1100" opacity="0.6"/>
          <ellipse cx="24" cy="16" rx="5" ry="6" fill="#dd3300" opacity="0.8"/>
          <ellipse cx="21" cy="14" rx="3" ry="4" fill="#ff5500" opacity="0.9"/>
          <ellipse cx="27" cy="13" rx="3" ry="4" fill="#ff4400" opacity="0.85"/>
          <ellipse cx="24" cy="11" rx="4" ry="5" fill="#ff6600" opacity="0.95"/>
          <ellipse cx="22" cy="9" rx="2.5" ry="3.5" fill="#ff9900"/>
          <ellipse cx="26" cy="8" rx="2" ry="3" fill="#ffaa00"/>
          <ellipse cx="24" cy="7" rx="2.5" ry="3" fill="#ffcc00"/>
          <ellipse cx="23" cy="5" rx="1.5" ry="2.5" fill="#ffee44"/>
          <ellipse cx="25" cy="4" rx="1" ry="2" fill="#ffff88"/>
          <!-- Ember sparks -->
          <circle cx="17" cy="16" r="1" fill="#ff6600" opacity="0.7"/>
          <circle cx="31" cy="14" r="0.8" fill="#ff8800" opacity="0.65"/>
          <circle cx="19" cy="11" r="0.7" fill="#ffaa00" opacity="0.6"/>
          <circle cx="30" cy="10" r="0.6" fill="#ffcc00" opacity="0.55"/>
          <circle cx="14" cy="20" r="0.8" fill="#ff4400" opacity="0.5"/>
          <!-- Dead branches poking out -->
          <path d="M11 22 Q14 18 16 20" stroke="#1a0e02" stroke-width="1.2" fill="none" opacity="0.8"/>
          <path d="M37 22 Q34 18 32 20" stroke="#1a0e02" stroke-width="1.2" fill="none" opacity="0.8"/>
          <path d="M11 22 Q10 19 12 17" stroke="#1a0e02" stroke-width="0.8" fill="none" opacity="0.6"/>
          <path d="M37 22 Q38 19 36 17" stroke="#1a0e02" stroke-width="0.8" fill="none" opacity="0.6"/>
        </svg>`,

      ice_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Roots frozen in ice -->
          <path d="M20 44 Q16 40 13 44" stroke="#1a2a1a" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M28 44 Q32 40 35 44" stroke="#1a2a1a" stroke-width="1.5" fill="none" opacity="0.7"/>
          <path d="M22 44 Q17 39 14 41" stroke="#1a2a1a" stroke-width="1" fill="none" opacity="0.5"/>
          <path d="M26 44 Q31 39 34 41" stroke="#1a2a1a" stroke-width="1" fill="none" opacity="0.5"/>
          <!-- Ice coating on roots -->
          <path d="M20 44 Q16 40 13 44" stroke="#88ccff" stroke-width="0.6" fill="none" opacity="0.4"/>
          <path d="M28 44 Q32 40 35 44" stroke="#88ccff" stroke-width="0.6" fill="none" opacity="0.4"/>
          <!-- Trunk -->
          <rect x="20" y="28" width="8" height="16" fill="#1a2a1a" rx="1"/>
          <rect x="21" y="28" width="2" height="16" fill="#0f1a0f" opacity="0.6"/>
          <!-- Ice coating on trunk -->
          <rect x="20" y="28" width="2" height="16" fill="#aaddff" opacity="0.15"/>
          <rect x="26" y="28" width="2" height="16" fill="#aaddff" opacity="0.15"/>
          <!-- Icicles hanging from trunk -->
          <polygon points="21,38 22,44 23,38" fill="#aaddff" opacity="0.6"/>
          <polygon points="24,36 25,43 26,36" fill="#cceeff" opacity="0.55"/>
          <!-- Dark frozen canopy -->
          <ellipse cx="24" cy="26" rx="16" ry="14" fill="#081510"/>
          <ellipse cx="16" cy="28" rx="8" ry="7" fill="#061008"/>
          <ellipse cx="32" cy="28" rx="8" ry="7" fill="#061008"/>
          <!-- Mid canopy -->
          <ellipse cx="24" cy="22" rx="13" ry="11" fill="#0c1e12"/>
          <ellipse cx="18" cy="24" rx="7" ry="6" fill="#091808"/>
          <ellipse cx="30" cy="24" rx="7" ry="6" fill="#091808"/>
          <!-- Upper canopy -->
          <ellipse cx="24" cy="17" rx="10" ry="9" fill="#102818"/>
          <ellipse cx="24" cy="13" rx="7" ry="6" fill="#163520"/>
          <!-- Snow/ice patches on canopy -->
          <ellipse cx="16" cy="24" rx="4" ry="2.5" fill="#cce8ff" opacity="0.2"/>
          <ellipse cx="32" cy="26" rx="3.5" ry="2" fill="#cce8ff" opacity="0.18"/>
          <ellipse cx="24" cy="28" rx="5" ry="2" fill="#cce8ff" opacity="0.15"/>
          <ellipse cx="20" cy="16" rx="3" ry="1.5" fill="#ddeeff" opacity="0.2"/>
          <ellipse cx="29" cy="14" rx="2.5" ry="1.5" fill="#ddeeff" opacity="0.18"/>
          <!-- Large icicles on branches -->
          <polygon points="12,22 13.5,15 15,22" fill="#aaddff" opacity="0.85"/>
          <polygon points="13,22 14,16 15,22" fill="#ddeeff" opacity="0.6"/>
          <polygon points="33,24 34.5,17 36,24" fill="#aaddff" opacity="0.8"/>
          <polygon points="34,24 35,18 36,24" fill="#ddeeff" opacity="0.55"/>
          <polygon points="18,15 19,9 20,15" fill="#cceeff" opacity="0.75"/>
          <polygon points="18.5,15 19,10 19.5,15" fill="#eef8ff" opacity="0.5"/>
          <polygon points="27,14 28,8 29,14" fill="#cceeff" opacity="0.75"/>
          <polygon points="27.5,14 28,9 28.5,14" fill="#eef8ff" opacity="0.5"/>
          <!-- Frozen branches -->
          <path d="M10 24 Q13 20 16 22" stroke="#0f2018" stroke-width="1.5" fill="none"/>
          <path d="M38 24 Q35 20 32 22" stroke="#0f2018" stroke-width="1.5" fill="none"/>
          <path d="M10 24 Q9 21 11 19" stroke="#0f2018" stroke-width="1" fill="none" opacity="0.7"/>
          <path d="M38 24 Q39 21 37 19" stroke="#0f2018" stroke-width="1" fill="none" opacity="0.7"/>
          <!-- Ice coating on branches -->
          <path d="M10 24 Q13 20 16 22" stroke="#88ccff" stroke-width="0.7" fill="none" opacity="0.5"/>
          <path d="M38 24 Q35 20 32 22" stroke="#88ccff" stroke-width="0.7" fill="none" opacity="0.5"/>
          <!-- Ice crystal centerpiece -->
          <line x1="24" y1="12" x2="24" y2="28" stroke="#55aaff" stroke-width="1.4" opacity="0.9"/>
          <line x1="16" y1="20" x2="32" y2="20" stroke="#55aaff" stroke-width="1.4" opacity="0.9"/>
          <line x1="18.5" y1="14.5" x2="29.5" y2="25.5" stroke="#55aaff" stroke-width="1" opacity="0.7"/>
          <line x1="29.5" y1="14.5" x2="18.5" y2="25.5" stroke="#55aaff" stroke-width="1" opacity="0.7"/>
          <!-- Orb -->
          <circle cx="24" cy="20" r="6" fill="#003366" opacity="0.5"/>
          <circle cx="24" cy="20" r="4" fill="#0055aa" opacity="0.6"/>
          <circle cx="24" cy="20" r="2.5" fill="#44aadd" opacity="0.8"/>
          <circle cx="24" cy="20" r="1" fill="#aaddff" opacity="0.95"/>
          <circle cx="22.5" cy="18.5" r="0.8" fill="#ffffff" opacity="0.7"/>
          <!-- Frost particles -->
          <circle cx="14" cy="18" r="1" fill="#aaddff" opacity="0.5"/>
          <circle cx="34" cy="16" r="0.8" fill="#88ccff" opacity="0.45"/>
          <circle cx="18" cy="10" r="0.7" fill="#cceeff" opacity="0.4"/>
          <circle cx="30" cy="10" r="0.7" fill="#cceeff" opacity="0.4"/>
          <!-- Icicles at top -->
          <polygon points="21,6 22,1 23,6" fill="#aaddff" opacity="0.7"/>
          <polygon points="25,7 26,2 27,7" fill="#88ccff" opacity="0.65"/>
        </svg>`,

      arcane_forest: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Twisted roots -->
          <path d="M20 44 Q15 39 12 44" stroke="#1a051a" stroke-width="1.8" fill="none" opacity="0.9"/>
          <path d="M28 44 Q33 39 36 44" stroke="#1a051a" stroke-width="1.8" fill="none" opacity="0.9"/>
          <path d="M21 44 Q16 37 13 40" stroke="#1a051a" stroke-width="1.2" fill="none" opacity="0.6"/>
          <path d="M27 44 Q32 37 35 40" stroke="#1a051a" stroke-width="1.2" fill="none" opacity="0.6"/>
          <!-- Purple veins on roots -->
          <path d="M20 44 Q15 39 12 44" stroke="#8800cc" stroke-width="0.6" fill="none" opacity="0.5"/>
          <path d="M28 44 Q33 39 36 44" stroke="#8800cc" stroke-width="0.6" fill="none" opacity="0.5"/>
          <!-- Trunk -->
          <rect x="20" y="28" width="8" height="16" fill="#1e041e" rx="1"/>
          <rect x="21" y="28" width="2" height="16" fill="#14021a" opacity="0.7"/>
          <rect x="25" y="28" width="2" height="16" fill="#14021a" opacity="0.5"/>
          <!-- Arcane veins on trunk -->
          <path d="M22 30 Q21 35 23 40" stroke="#7700aa" stroke-width="0.8" fill="none" opacity="0.6"/>
          <path d="M26 32 Q27 37 25 42" stroke="#7700aa" stroke-width="0.8" fill="none" opacity="0.5"/>
          <path d="M23 29 Q25 33 22 37" stroke="#cc44ff" stroke-width="0.5" fill="none" opacity="0.4"/>
          <!-- Outer dark canopy -->
          <ellipse cx="24" cy="26" rx="16" ry="14" fill="#0e020e"/>
          <ellipse cx="16" cy="28" rx="8" ry="7" fill="#0b020b"/>
          <ellipse cx="32" cy="28" rx="8" ry="7" fill="#0b020b"/>
          <!-- Mid canopy -->
          <ellipse cx="24" cy="22" rx="13" ry="11" fill="#160516"/>
          <ellipse cx="18" cy="24" rx="7" ry="6" fill="#120412"/>
          <ellipse cx="30" cy="24" rx="7" ry="6" fill="#120412"/>
          <!-- Upper canopy -->
          <ellipse cx="24" cy="17" rx="10" ry="9" fill="#1e061e"/>
          <ellipse cx="24" cy="13" rx="7" ry="6" fill="#280a28"/>
          <!-- Purple corruption patches -->
          <ellipse cx="16" cy="24" rx="4" ry="3" fill="#4400aa" opacity="0.25"/>
          <ellipse cx="32" cy="26" rx="3.5" ry="2.5" fill="#4400aa" opacity="0.2"/>
          <ellipse cx="24" cy="28" rx="5" ry="2" fill="#5500bb" opacity="0.2"/>
          <ellipse cx="20" cy="16" rx="3" ry="2" fill="#6600cc" opacity="0.22"/>
          <ellipse cx="29" cy="15" rx="2.5" ry="2" fill="#6600cc" opacity="0.2"/>
          <!-- Dead twisted branches -->
          <path d="M10 24 Q13 19 17 21" stroke="#140214" stroke-width="1.8" fill="none"/>
          <path d="M38 24 Q35 19 31 21" stroke="#140214" stroke-width="1.8" fill="none"/>
          <path d="M10 24 Q8 20 11 17" stroke="#140214" stroke-width="1.2" fill="none" opacity="0.8"/>
          <path d="M38 24 Q40 20 37 17" stroke="#140214" stroke-width="1.2" fill="none" opacity="0.8"/>
          <path d="M10 24 Q11 22 9 20" stroke="#140214" stroke-width="0.8" fill="none" opacity="0.6"/>
          <path d="M38 24 Q37 22 39 20" stroke="#140214" stroke-width="0.8" fill="none" opacity="0.6"/>
          <!-- Purple glow on branches -->
          <path d="M10 24 Q13 19 17 21" stroke="#6600aa" stroke-width="0.7" fill="none" opacity="0.45"/>
          <path d="M38 24 Q35 19 31 21" stroke="#6600aa" stroke-width="0.7" fill="none" opacity="0.45"/>
          <!-- Arcane wisps floating -->
          <circle cx="13" cy="20" r="1.5" fill="#aa33ff" opacity="0.6"/>
          <circle cx="12" cy="19" r="0.7" fill="#dd88ff" opacity="0.5"/>
          <circle cx="35" cy="18" r="1.3" fill="#aa33ff" opacity="0.55"/>
          <circle cx="36" cy="17" r="0.6" fill="#dd88ff" opacity="0.45"/>
          <circle cx="18" cy="11" r="1.2" fill="#cc44ff" opacity="0.5"/>
          <circle cx="30" cy="10" r="1" fill="#cc44ff" opacity="0.45"/>
          <circle cx="14" cy="30" r="1" fill="#9922dd" opacity="0.4"/>
          <circle cx="34" cy="28" r="1" fill="#9922dd" opacity="0.4"/>
          <!-- Large arcane sigil in canopy -->
          <polygon points="24,9 26,15.5 33,15.5 27.5,19.5 29.5,26 24,22 18.5,26 20.5,19.5 15,15.5 22,15.5" fill="#cc44ff" opacity="0.85"/>
          <polygon points="24,11 25.6,15.8 31.5,15.8 26.8,19.2 28.5,25 24,21.5 19.5,25 21.2,19.2 16.5,15.8 22.4,15.8" fill="#2a004a" opacity="0.7"/>
          <!-- Orb -->
          <circle cx="24" cy="19" r="6" fill="#4400aa" opacity="0.45"/>
          <circle cx="24" cy="19" r="4" fill="#7700cc" opacity="0.6"/>
          <circle cx="24" cy="19" r="2.5" fill="#bb44ff" opacity="0.85"/>
          <circle cx="24" cy="19" r="1" fill="#eeccff" opacity="0.95"/>
          <circle cx="22.8" cy="17.8" r="0.7" fill="#ffffff" opacity="0.7"/>
          <!-- Arcane rays from orb -->
          <line x1="24" y1="10" x2="24" y2="28" stroke="#9922ee" stroke-width="0.8" opacity="0.5"/>
          <line x1="15" y1="19" x2="33" y2="19" stroke="#9922ee" stroke-width="0.8" opacity="0.5"/>
          <line x1="17.5" y1="12.5" x2="30.5" y2="25.5" stroke="#9922ee" stroke-width="0.6" opacity="0.4"/>
          <line x1="30.5" y1="12.5" x2="17.5" y2="25.5" stroke="#9922ee" stroke-width="0.6" opacity="0.4"/>
          <!-- Floating rune fragments -->
          <path d="M11 15 L13 12 L15 15 L13 18 Z" stroke="#8800dd" stroke-width="0.7" fill="none" opacity="0.5"/>
          <path d="M33 13 L35 10 L37 13 L35 16 Z" stroke="#8800dd" stroke-width="0.7" fill="none" opacity="0.45"/>
          <!-- Purple mist at base -->
          <ellipse cx="14" cy="44" rx="5" ry="2" fill="#4400aa" opacity="0.3"/>
          <ellipse cx="34" cy="44" rx="5" ry="2" fill="#4400aa" opacity="0.3"/>
          <ellipse cx="24" cy="44" rx="6" ry="2" fill="#6600cc" opacity="0.25"/>
        </svg>`,

      // VOLCANIC
      fire_volcanic: `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <!-- Mountain layers -->
          <polygon points="24,4 46,44 2,44" fill="#150200"/>
          <polygon points="24,6 44,44 4,44" fill="#1c0300"/>
          <polygon points="24,9 42,44 6,44" fill="#240500"/>
          <polygon points="24,12 40,44 8,44" fill="#2e0700"/>
          <polygon points="24,15 38,44 10,44" fill="#380900"/>
          <!-- Lava flows down the sides -->
          <path d="M24 15 Q18 22 16 30 Q14 38 15 44" stroke="#cc2200" stroke-width="2.5" fill="none" opacity="0.7"/>
          <path d="M24 15 Q30 22 32 30 Q34 38 33 44" stroke="#cc2200" stroke-width="2.5" fill="none" opacity="0.7"/>
          <path d="M24 15 Q18 22 16 30 Q14 38 15 44" stroke="#ff4400" stroke-width="1.2" fill="none" opacity="0.6"/>
          <path d="M24 15 Q30 22 32 30 Q34 38 33 44" stroke="#ff4400" stroke-width="1.2" fill="none" opacity="0.6"/>
          <!-- Secondary lava streams -->
          <path d="M20 20 Q16 28 17 36 Q17 40 18 44" stroke="#ff3300" stroke-width="1.5" fill="none" opacity="0.5"/>
          <path d="M28 20 Q32 28 31 36 Q31 40 30 44" stroke="#ff3300" stroke-width="1.5" fill="none" opacity="0.5"/>
          <!-- Rock outcropppings -->
          <polygon points="8,38 12,30 16,38" fill="#1a0400" opacity="0.9"/>
          <polygon points="40,38 36,30 32,38" fill="#1a0400" opacity="0.9"/>
          <polygon points="6,44 10,36 14,44" fill="#220500" opacity="0.8"/>
          <polygon points="42,44 38,36 34,44" fill="#220500" opacity="0.8"/>
          <!-- Base lava pool -->
          <rect x="8" y="40" width="32" height="4" fill="#3a0800" rx="1"/>
          <ellipse cx="24" cy="44" rx="18" ry="2" fill="#cc1100" opacity="0.4"/>
          <ellipse cx="24" cy="44" rx="12" ry="1.5" fill="#ff3300" opacity="0.35"/>
          <!-- Lava pool bubbles -->
          <ellipse cx="14" cy="42" rx="3" ry="1.5" fill="#ff2200" opacity="0.55"/>
          <ellipse cx="34" cy="42" rx="3" ry="1.5" fill="#ff2200" opacity="0.5"/>
          <ellipse cx="24" cy="43" rx="4" ry="1.5" fill="#ff4400" opacity="0.45"/>
          <!-- Crater rim -->
          <ellipse cx="24" cy="16" rx="10" ry="4" fill="#1a0300" opacity="0.8"/>
          <ellipse cx="24" cy="16" rx="8" ry="3" fill="#cc1100" opacity="0.5"/>
          <!-- Eruption fire layers -->
          <ellipse cx="24" cy="18" rx="9" ry="7" fill="#aa0a00" opacity="0.75"/>
          <ellipse cx="24" cy="15" rx="7" ry="6" fill="#cc1500" opacity="0.8"/>
          <ellipse cx="22" cy="13" rx="5" ry="5" fill="#ee2200" opacity="0.85"/>
          <ellipse cx="26" cy="12" rx="4" ry="4.5" fill="#ff3300" opacity="0.85"/>
          <ellipse cx="24" cy="10" rx="5" ry="5" fill="#ff4400" opacity="0.9"/>
          <ellipse cx="23" cy="8" rx="3.5" ry="4" fill="#ff6600"/>
          <ellipse cx="25" cy="7" rx="3" ry="3.5" fill="#ff8800"/>
          <ellipse cx="24" cy="6" rx="3" ry="3" fill="#ffaa00"/>
          <ellipse cx="24" cy="4" rx="2" ry="2.5" fill="#ffcc00"/>
          <ellipse cx="24" cy="3" rx="1.5" ry="2" fill="#ffee44"/>
          <ellipse cx="24" cy="2" rx="1" ry="1.5" fill="#ffff88"/>
          <!-- Flying lava rocks -->
          <circle cx="16" cy="12" r="1.5" fill="#cc2200" opacity="0.8"/>
          <circle cx="15" cy="11" r="0.7" fill="#ff4400" opacity="0.6"/>
          <circle cx="32" cy="10" r="1.3" fill="#cc2200" opacity="0.75"/>
          <circle cx="33" cy="9" r="0.6" fill="#ff4400" opacity="0.55"/>
          <circle cx="19" cy="7" r="1" fill="#ee3300" opacity="0.7"/>
          <circle cx="29" cy="6" r="1" fill="#ee3300" opacity="0.65"/>
          <circle cx="13" cy="16" r="0.8" fill="#ff5500" opacity="0.5"/>
          <circle cx="35" cy="14" r="0.8" fill="#ff5500" opacity="0.5"/>
          <!-- Smoke wisps -->
          <path d="M20 8 Q18 4 20 2" stroke="#442200" stroke-width="1.5" fill="none" opacity="0.4"/>
          <path d="M28 7 Q30 3 28 1" stroke="#442200" stroke-width="1.5" fill="none" opacity="0.35"/>
          <path d="M24 5 Q22 2 24 0" stroke="#442200" stroke-width="1.2" fill="none" opacity="0.3"/>
          <!-- Rock texture lines -->
          <path d="M10 32 Q14 28 18 32" stroke="#0f0200" stroke-width="0.8" fill="none" opacity="0.5"/>
          <path d="M30 32 Q34 28 38 32" stroke="#0f0200" stroke-width="0.8" fill="none" opacity="0.5"/>
          <path d="M12 38 Q16 34 20 38" stroke="#0f0200" stroke-width="0.7" fill="none" opacity="0.4"/>
          <path d="M28 38 Q32 34 36 38" stroke="#0f0200" stroke-width="0.7" fill="none" opacity="0.4"/>
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
        </svg>`,

        fire_poison: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="8" y="16" width="32" height="28" fill="#0d1f05" rx="2"/>
            <rect x="4" y="12" width="10" height="16" fill="#142808" rx="1"/>
            <rect x="34" y="12" width="10" height="16" fill="#142808" rx="1"/>
            <rect x="14" y="8" width="8" height="10" fill="#142808"/>
            <rect x="26" y="8" width="8" height="10" fill="#142808"/>
            <rect x="6" y="10" width="3" height="4" fill="#0a1804"/>
            <rect x="10" y="10" width="3" height="4" fill="#0a1804"/>
            <rect x="35" y="10" width="3" height="4" fill="#0a1804"/>
            <rect x="39" y="10" width="3" height="4" fill="#0a1804"/>
            <rect x="20" y="26" width="8" height="18" fill="#0d1e06"/>
            <ellipse cx="24" cy="19" rx="9" ry="7" fill="#cc3300" opacity="0.7"/>
            <ellipse cx="24" cy="17" rx="6" ry="5" fill="#ff5500" opacity="0.85"/>
            <ellipse cx="22" cy="14" rx="3" ry="4" fill="#ff8800"/>
            <ellipse cx="26" cy="13" rx="2" ry="3" fill="#ffbb00"/>
            <ellipse cx="24" cy="12" rx="2" ry="2" fill="#ffff88"/>
            <circle cx="10" cy="26" r="2" fill="#33aa10" opacity="0.5"/>
            <circle cx="38" cy="26" r="2" fill="#33aa10" opacity="0.5"/>
          </svg>`,

        ice_poison: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="8" y="16" width="32" height="28" fill="#061505" rx="2"/>
            <rect x="4" y="12" width="10" height="16" fill="#0a1e08" rx="1"/>
            <rect x="34" y="12" width="10" height="16" fill="#0a1e08" rx="1"/>
            <rect x="14" y="8" width="8" height="10" fill="#0a1e08"/>
            <rect x="26" y="8" width="8" height="10" fill="#0a1e08"/>
            <rect x="6" y="10" width="3" height="4" fill="#050f04"/>
            <rect x="10" y="10" width="3" height="4" fill="#050f04"/>
            <rect x="35" y="10" width="3" height="4" fill="#050f04"/>
            <rect x="39" y="10" width="3" height="4" fill="#050f04"/>
            <rect x="20" y="26" width="8" height="18" fill="#071205"/>
            <line x1="24" y1="10" x2="24" y2="32" stroke="#44ff44" stroke-width="1" opacity="0.8"/>
            <line x1="12" y1="21" x2="36" y2="21" stroke="#44ff44" stroke-width="1" opacity="0.8"/>
            <line x1="15" y1="13" x2="33" y2="29" stroke="#44ff44" stroke-width="0.7" opacity="0.6"/>
            <line x1="33" y1="13" x2="15" y2="29" stroke="#44ff44" stroke-width="0.7" opacity="0.6"/>
            <circle cx="24" cy="21" r="7" fill="#005500" opacity="0.5"/>
            <circle cx="24" cy="21" r="4" fill="#22aa22" opacity="0.6"/>
            <circle cx="24" cy="21" r="2" fill="#88ff88" opacity="0.9"/>
            <circle cx="10" cy="26" r="1.5" fill="#44cc14" opacity="0.5"/>
            <circle cx="38" cy="26" r="1.5" fill="#44cc14" opacity="0.5"/>
          </svg>`,

        arcane_poison: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="8" y="16" width="32" height="28" fill="#0a1a06" rx="2"/>
            <rect x="4" y="12" width="10" height="16" fill="#102208" rx="1"/>
            <rect x="34" y="12" width="10" height="16" fill="#102208" rx="1"/>
            <rect x="14" y="8" width="8" height="10" fill="#102208"/>
            <rect x="26" y="8" width="8" height="10" fill="#102208"/>
            <rect x="6" y="10" width="3" height="4" fill="#081505"/>
            <rect x="10" y="10" width="3" height="4" fill="#081505"/>
            <rect x="35" y="10" width="3" height="4" fill="#081505"/>
            <rect x="39" y="10" width="3" height="4" fill="#081505"/>
            <rect x="20" y="26" width="8" height="18" fill="#0a1806"/>
            <circle cx="24" cy="20" r="9" fill="#226600" opacity="0.4"/>
            <polygon points="24,9 26.4,16.2 34,16.2 28,21 30.4,28.2 24,24 17.6,28.2 20,21 14,16.2 21.6,16.2" fill="#66ff22" opacity="0.85"/>
            <circle cx="24" cy="20" r="3" fill="#99ff66" opacity="0.8"/>
            <circle cx="24" cy="20" r="1.5" fill="#eeffcc" opacity="0.7"/>
            <circle cx="10" cy="26" r="1.5" fill="#44aa10" opacity="0.6"/>
            <circle cx="38" cy="26" r="1.5" fill="#44aa10" opacity="0.6"/>
          </svg>`,

          poison_dungeon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="8" y="16" width="32" height="28" fill="#1a2208" rx="2"/>
            <rect x="4" y="12" width="10" height="16" fill="#222e0a" rx="1"/>
            <rect x="34" y="12" width="10" height="16" fill="#222e0a" rx="1"/>
            <rect x="14" y="8" width="8" height="10" fill="#222e0a"/>
            <rect x="26" y="8" width="8" height="10" fill="#222e0a"/>
            <rect x="20" y="26" width="8" height="18" fill="#161f06"/>
            <circle cx="24" cy="19" r="8" fill="#225500" opacity="0.6"/>
            <circle cx="24" cy="19" r="5" fill="#44aa00" opacity="0.75"/>
            <circle cx="24" cy="19" r="2.5" fill="#88ff22" opacity="0.9"/>
            <circle cx="18" cy="14" r="1.5" fill="#66cc00" opacity="0.5"/>
            <circle cx="30" cy="14" r="1.5" fill="#66cc00" opacity="0.5"/>
            <circle cx="14" cy="28" r="1.5" fill="#44aa00" opacity="0.4"/>
            <circle cx="34" cy="28" r="1.5" fill="#44aa00" opacity="0.4"/>
          </svg>`,

        poison_forest: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="20" y="30" width="8" height="14" fill="#1e2a06"/>
            <ellipse cx="24" cy="25" rx="15" ry="13" fill="#14200a"/>
            <ellipse cx="19" cy="27" rx="8" ry="7" fill="#101a06"/>
            <ellipse cx="29" cy="27" rx="8" ry="7" fill="#101a06"/>
            <ellipse cx="24" cy="19" rx="11" ry="10" fill="#1c3208"/>
            <ellipse cx="24" cy="14" rx="8" ry="7" fill="#28480c"/>
            <circle cx="24" cy="19" r="6" fill="#44aa00" opacity="0.7"/>
            <circle cx="24" cy="19" r="3" fill="#88ff22" opacity="0.85"/>
            <circle cx="16" cy="22" r="1.5" fill="#66cc00" opacity="0.6"/>
            <circle cx="32" cy="20" r="1.5" fill="#66cc00" opacity="0.5"/>
            <circle cx="22" cy="11" r="1.2" fill="#aaff44" opacity="0.6"/>
          </svg>`,

        poison_volcanic: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <polygon points="24,4 44,44 4,44" fill="#0f1c00"/>
            <polygon points="24,8 41,44 7,44" fill="#172a00"/>
            <polygon points="24,12 38,44 10,44" fill="#1f3800"/>
            <rect x="10" y="38" width="28" height="6" fill="#244000"/>
            <circle cx="24" cy="18" r="7" fill="#225500" opacity="0.7"/>
            <circle cx="24" cy="15" r="4.5" fill="#44aa00" opacity="0.85"/>
            <circle cx="24" cy="12" r="2.5" fill="#88ff22"/>
            <circle cx="17" cy="38" r="2" fill="#33aa00" opacity="0.5"/>
            <circle cx="31" cy="38" r="2" fill="#33aa00" opacity="0.5"/>
          </svg>`,

        poison_frozen: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="10" y="18" width="28" height="26" fill="#7a9a6a" rx="2" opacity="0.95"/>
            <rect x="6" y="12" width="10" height="18" fill="#8eae7e" rx="1"/>
            <rect x="32" y="12" width="10" height="18" fill="#8eae7e" rx="1"/>
            <rect x="18" y="28" width="12" height="16" fill="#5a7848"/>
            <rect x="20" y="20" width="8" height="10" fill="#42603a"/>
            <circle cx="24" cy="20" r="6" fill="#225500" opacity="0.7"/>
            <circle cx="24" cy="20" r="3" fill="#66cc00" opacity="0.85"/>
            <circle cx="24" cy="20" r="1.3" fill="#aaff44"/>
            <ellipse cx="11" cy="29" rx="2" ry="5" fill="#cce0ee" opacity="0.4"/>
            <ellipse cx="37" cy="29" rx="2" ry="5" fill="#cce0ee" opacity="0.4"/>
          </svg>`,

        poison_void: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <circle cx="24" cy="26" r="20" fill="#050f00"/>
            <circle cx="24" cy="26" r="16" fill="#0a1a00"/>
            <circle cx="24" cy="26" r="11" fill="#102800"/>
            <circle cx="24" cy="20" r="7" fill="#225500" opacity="0.75"/>
            <circle cx="24" cy="20" r="4" fill="#66cc00" opacity="0.85"/>
            <circle cx="24" cy="20" r="1.8" fill="#aaff44"/>
            <circle cx="14" cy="30" r="1.5" fill="#33aa00" opacity="0.5"/>
            <circle cx="34" cy="30" r="1.5" fill="#33aa00" opacity="0.5"/>
            <circle cx="16" cy="18" r="1.5" fill="#44cc00" opacity="0.5"/>
            <circle cx="32" cy="18" r="1.5" fill="#44cc00" opacity="0.5"/>
          </svg>`,

        poison_poison: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect x="8" y="16" width="32" height="28" fill="#0a1804" rx="2"/>
            <rect x="4" y="12" width="10" height="16" fill="#0e2006" rx="1"/>
            <rect x="34" y="12" width="10" height="16" fill="#0e2006" rx="1"/>
            <rect x="20" y="26" width="8" height="18" fill="#081404"/>
            <circle cx="24" cy="19" r="9" fill="#225500" opacity="0.65"/>
            <circle cx="24" cy="17" r="6" fill="#44aa00" opacity="0.8"/>
            <circle cx="24" cy="14" r="3.5" fill="#88ff22" opacity="0.9"/>
            <circle cx="24" cy="12" r="1.8" fill="#ccff88"/>
            <circle cx="14" cy="24" r="1.8" fill="#33aa00" opacity="0.5"/>
            <circle cx="34" cy="24" r="1.8" fill="#33aa00" opacity="0.5"/>
            <circle cx="18" cy="14" r="1.3" fill="#66cc00" opacity="0.5"/>
            <circle cx="30" cy="14" r="1.3" fill="#66cc00" opacity="0.5"/>
          </svg>`,

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
        </svg>`,

        poison: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <rect width="48" height="48" fill="#030a01"/>
            <rect x="1" y="1" width="46" height="46" fill="#050f02" rx="1"/>
            <ellipse cx="12" cy="12" rx="9" ry="6" fill="#0a2204" opacity="0.9"/>
            <ellipse cx="36" cy="10" rx="7" ry="5" fill="#0c2805" opacity="0.8"/>
            <ellipse cx="8" cy="36" rx="7" ry="5" fill="#0a2204" opacity="0.8"/>
            <ellipse cx="38" cy="38" rx="8" ry="5" fill="#0c2805" opacity="0.9"/>
            <ellipse cx="24" cy="26" rx="11" ry="7" fill="#0a2204" opacity="0.85"/>
            <ellipse cx="12" cy="12" rx="6" ry="4" fill="#44cc00" opacity="0.12"/>
            <ellipse cx="36" cy="38" rx="6" ry="4" fill="#44cc00" opacity="0.1"/>
            <ellipse cx="24" cy="26" rx="7" ry="4" fill="#44cc00" opacity="0.08"/>
            <circle cx="10" cy="18" r="3" fill="#1a5500" opacity="0.7"/>
            <circle cx="10" cy="18" r="1.5" fill="#44cc00" opacity="0.5"/>
            <circle cx="38" cy="14" r="2.5" fill="#1a5500" opacity="0.6"/>
            <circle cx="38" cy="14" r="1.2" fill="#44cc00" opacity="0.45"/>
            <circle cx="22" cy="38" r="3.5" fill="#1a5500" opacity="0.65"/>
            <circle cx="22" cy="38" r="1.8" fill="#44cc00" opacity="0.5"/>
            <circle cx="42" cy="28" r="2" fill="#1a5500" opacity="0.55"/>
            <circle cx="42" cy="28" r="1" fill="#44cc00" opacity="0.4"/>
            <circle cx="6" cy="26" r="2.5" fill="#1a5500" opacity="0.6"/>
            <circle cx="6" cy="26" r="1.2" fill="#44cc00" opacity="0.45"/>
            <path d="M4 8 Q8 4 14 8 Q18 12 14 18 Q10 22 6 18 Q2 14 4 8" stroke="#1a5500" stroke-width="0.8" fill="none" opacity="0.5"/>
            <path d="M34 28 Q38 24 44 28 Q46 34 42 38 Q38 42 34 38 Q30 34 34 28" stroke="#1a5500" stroke-width="0.8" fill="none" opacity="0.45"/>
            <circle cx="28" cy="8" r="1.5" fill="#66ff00" opacity="0.25"/>
            <circle cx="16" cy="42" r="1.2" fill="#66ff00" opacity="0.2"/>
            <circle cx="44" cy="16" r="1" fill="#66ff00" opacity="0.2"/>
            <line x1="0" y1="0" x2="48" y2="0" stroke="#0a1f04" stroke-width="0.5"/>
            <line x1="0" y1="0" x2="0" y2="48" stroke="#0a1f04" stroke-width="0.5"/>
          </svg>`,
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

      poison: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <defs>
          <radialGradient id="pg" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#ccffaa"/>
            <stop offset="45%" stop-color="#44cc00"/>
            <stop offset="100%" stop-color="#115500" stop-opacity="0.95"/>
          </radialGradient>
        </defs>
        <circle cx="8" cy="8" r="7" fill="#44ff00" opacity="0.2"/>
        <circle cx="8" cy="8" r="5" fill="url(#pg)"/>
        <circle cx="8" cy="8" r="3" fill="#88ff44" opacity="0.4"/>
        <circle cx="7" cy="6.5" r="1" fill="#eeffcc" opacity="0.7"/>
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