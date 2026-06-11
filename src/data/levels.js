// ── Tower position pools ───────────────────────────────────────────────
const POS_POOL = [
  {col:5, row:5},  {col:7, row:9},  {col:3, row:7},
  {col:8, row:4},  {col:2, row:4},  {col:6, row:12},
  {col:4, row:3},  {col:8, row:11}, {col:2, row:10},
  {col:6, row:7},  {col:9, row:6},  {col:1, row:6},
  {col:7, row:3},  {col:3, row:11}, {col:5, row:9},
  {col:9, row:12}, {col:1, row:3},  {col:7, row:6},
];

function generateTowers(count, levelId, worlds) {
  const offset  = (levelId * 3) % POS_POOL.length;
  const rotated = [...POS_POOL.slice(offset), ...POS_POOL.slice(0, offset)];
  const types   = ['fire', 'ice', 'arcane'];

  // Distribute tower types across worlds evenly
  return rotated.slice(0, count).map((pos, i) => ({
    ...pos,
    type:  types[i % 3],
    world: worlds[i % worlds.length],
  }));
}

function makeMechanics(worlds, shootDelay, levelId) {
  const m = {};

  // Bullet speed — κληρονομείται και αυξάνεται ανά world
  if (worlds.includes('forest')) {
    const t = Math.min(1, (levelId - 11) / 9);
    m.bulletDuration = Math.round(450 - t * 100); // 300→200ms (γρηγορότερο)
  }

  if (worlds.includes('volcanic')) {
    m.grenadePeriod  = 3;
    const t = Math.min(1, (levelId - 21) / 9); // ← ΠΡΟΣΘΕΣΕ ΕΔΩ
    m.bulletDuration = m.bulletDuration ?? Math.round(400 - t * 80);
  }

  if (worlds.includes('void')) {
    const t = Math.min(1, (levelId - 41) / 9);
    m.towerMoveDelay = Math.round(2000 - t * 1100); // 2000→1100ms (πιο γρήγορη κίνηση)
    m.bulletDuration = m.bulletDuration ?? Math.round(400 - t * 80);
  }

  // Στο makeMechanics — το freeze να είναι λίγο πιο ελαφρύ σε mix worlds
  if (worlds.includes('frozen')) {
    const t = Math.min(1, (levelId - 31) / 9);
    m.bulletDuration = m.bulletDuration ?? Math.round(380 - t * 80)
    m.freezeDuration = worlds.length > 1 ? 400 : 600; // λιγότερο σε mix
    m.freezePeriod   = worlds.length > 1 ? 6 : 3;
  }

  return m;
}

// ── World themes ──────────────────────────────────────────────────────
const WORLD_NAMES = {
  dungeon:  ['The Outskirts','The Corridor','Dark Halls','Stone Keep','The Dungeon','Ancient Vaults','Crypt Entrance','The Catacombs','Bone Chamber','The Throne'],
  forest:   ['Cursed Grove','Twisted Paths','Dark Canopy','The Thicket','Root Maze','Elder Trees','The Hollow','Witch Woods','Shadow Pines','The Heart'],
  volcanic: ['Ember Fields','Lava Flow','Ash Plains','Magma Gate','Fire Pits','The Caldera','Inferno Pass','Molten Core','Brimstone','The Volcano'],
  frozen:   ['Frost Edge','Ice Plains','Blizzard Pass','Frozen Lake','Glacial Rift','The Tundra','Crystal Caves','Permafrost','The Blizzard','The Citadel'],
  void:     ['The Rift','Dark Matter','Null Space','The Abyss','Shadow Realm','Void Nexus','The Nothing','Dark Infinity','Oblivion','The End'],
};

const MIX_NAMES = [
  'Cursed Dungeon','Volcanic Grove','Frozen Crypt','Void Forest',
  'Ash Citadel','Lava Frost','Dark Volcano','Void Citadel',
  'Shadow Forge','Burning Ice','Null Crypt','Abyssal Grove',
  'Infernal Frost','Void Ember','Cursed Caldera','Dark Blizzard',
  'Bone Volcano','Shadow Ice','Lava Void','Cursed Abyss',
  'Frozen Rift','Dark Ember','Void Frost','Shadow Dungeon',
  'Burning Void','Ice Rift','Dark Caldera','Frozen Null',
  'Abyssal Fire','Cursed Void',
];

const HELL_NAMES = [
  'Hellgate I','Hellgate II','Hellgate III',
  'Oblivion I','Oblivion II','Oblivion III',
  'The Apocalypse I','The Apocalypse II','The Apocalypse III',
  'THE END',
];

// ── Level builder ─────────────────────────────────────────────────────
function buildLevel(id, worlds, towerCount, required, shootDelay, nameOverride) {
  const primaryWorld = worlds[0];
  const nameIndex    = (id - 1) % 10;
  const name         = nameOverride
    ?? (worlds.length === 1 ? WORLD_NAMES[primaryWorld][nameIndex] : null)
    ?? 'Unknown';

  const mechanics = makeMechanics(worlds, shootDelay, id);
  const towers    = generateTowers(towerCount, id, worlds);

  // Primary world = first world (determines terrain + base sprite)
  return { id, name, world: primaryWorld, worlds, shootDelay, required, towers, mechanics };
}

// ── Generate all levels ────────────────────────────────────────────────
const levels = [];

// ── WORLDS 1-50 ───────────────────────────────────────────────────────

// Dungeon 1-10: shootDelay 1600→1200 (ήταν 2000→1720)
for (let i = 0; i < 10; i++) {
  const id         = i + 1;
  const towerCount = i + 1;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(1300 - i * 40);
  levels.push(buildLevel(id, ['dungeon'], towerCount, required, shootDelay));
}

// Forest 11-20: shootDelay 1100→800 + fast bullets
for (let i = 0; i < 10; i++) {
  const id         = 11 + i;
  const towerCount = i + 2;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(1200 - i * 30);
  levels.push(buildLevel(id, ['forest'], towerCount, required, shootDelay));
}

// Volcanic 21-30: shootDelay 900→650 + grenades
for (let i = 0; i < 10; i++) {
  const id         = 21 + i;
  const towerCount = i + 3;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(1050 - i * 25);
  levels.push(buildLevel(id, ['volcanic'], towerCount, required, shootDelay));
}

// Frozen 31-40: shootDelay 800→600 + freeze
for (let i = 0; i < 10; i++) {
  const id         = 31 + i;
  const towerCount = i + 4;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(800 - i * 20);
  levels.push(buildLevel(id, ['frozen'], towerCount, required, shootDelay));
}

// Void 41-50: shootDelay 700→500 + moving towers
for (let i = 0; i < 10; i++) {
  const id         = 41 + i;
  const towerCount = i + 5;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(700 - i * 18);
  levels.push(buildLevel(id, ['void'], towerCount, required, shootDelay));
}

// ── MIX WORLDS 51-80 ──────────────────────────────────────────────────
const mixConfigs = [
  // 51-54: Dungeon + Forest
  [['dungeon','forest'],  8, 4, 1050],
  [['dungeon','forest'],  9, 5, 1010],
  [['dungeon','forest'], 10, 6,  970],
  [['dungeon','forest'], 11, 6,  930],

  // 55-58: Dungeon + Volcanic
  [['dungeon','volcanic'], 10, 6, 920],
  [['dungeon','volcanic'], 11, 6, 895],
  [['dungeon','volcanic'], 12, 7, 870],
  [['dungeon','volcanic'], 13, 7, 845],

  // 59-62: Forest + Volcanic
  [['forest','volcanic'], 11, 6, 830],
  [['forest','volcanic'], 12, 7, 810],
  [['forest','volcanic'], 13, 7, 790],
  [['forest','volcanic'], 14, 8, 770],

  // 63-66: Forest + Frozen
  [['forest','frozen'], 12, 7, 755],
  [['forest','frozen'], 13, 7, 735],
  [['forest','frozen'], 14, 8, 715],
  [['forest','frozen'], 15, 8, 695],

  // 67-70: Volcanic + Frozen
  [['volcanic','frozen'], 13, 7, 680],
  [['volcanic','frozen'], 14, 8, 665],
  [['volcanic','frozen'], 15, 8, 650],
  [['volcanic','frozen'], 16, 9, 635],

  // 71-74: Frozen + Void
  [['frozen','void'], 14, 8, 620],
  [['frozen','void'], 15, 9, 605],
  [['frozen','void'], 16, 9, 590],
  [['frozen','void'], 17,10, 575],

  // 75-77: Dungeon + Forest + Volcanic
  [['dungeon','forest','volcanic'], 15, 9, 560],
  [['dungeon','forest','volcanic'], 16, 9, 545],
  [['dungeon','forest','volcanic'], 17,10, 530],

  // 78-80: Forest + Volcanic + Void
  [['forest','volcanic','void'], 16, 9, 515],
  [['forest','volcanic','void'], 17,10, 500],
  [['forest','volcanic','void'], 18,11, 485],
];

mixConfigs.forEach(([worlds, towerCount, required, shootDelay], i) => {
  const id = 51 + i;
  levels.push(buildLevel(id, worlds, towerCount, required, shootDelay, MIX_NAMES[i]));
});

// ── HELL MODE 81-90 ───────────────────────────────────────────────────
const hellConfigs = [
  [['dungeon','forest','volcanic','frozen'],        17, 11, 400],
  [['dungeon','forest','volcanic','frozen'],        18, 12, 370],
  [['dungeon','forest','volcanic','void'],          18, 12, 340],
  [['dungeon','forest','volcanic','void'],          19, 13, 310],
  [['forest','volcanic','frozen','void'],           19, 13, 280],
  [['forest','volcanic','frozen','void'],           20, 14, 250],
  [['dungeon','forest','volcanic','frozen','void'], 18, 14, 220],
  [['dungeon','forest','volcanic','frozen','void'], 19, 15, 190],
  [['dungeon','forest','volcanic','frozen','void'], 20, 16, 160],
  [['dungeon','forest','volcanic','frozen','void'], 22, 18, 130],
];

hellConfigs.forEach(([worlds, towerCount, required, shootDelay], i) => {
  const id = 81 + i;
  levels.push(buildLevel(id, worlds, towerCount, required, shootDelay, HELL_NAMES[i]));
});

export const LEVELS = levels;
export const TOTAL_LEVELS = levels.length; // 90