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
  const types   = worlds.includes('poison')
    ? ['fire', 'ice', 'arcane', 'poison']
    : ['fire', 'ice', 'arcane'];

  return rotated.slice(0, count).map((pos, i) => ({
    ...pos,
    type:  types[i % types.length],
    world: worlds[i % worlds.length],
  }));
}

function makeMechanics(worlds, shootDelay, levelId) {
  const m = {};

  if (worlds.includes('forest')) {
    const t = Math.min(1, (levelId - 11) / 9);
    m.bulletDuration = Math.round(440 - t * 100);
    m.trapCount = worlds.length > 1 ? 2 : 3; // max 3 σε pure forest, 2 σε mix
    m.trapInterval = Math.round(8000 - t * 3000); // 8s→5s μεταξύ νέων traps
  }

  if (worlds.includes('volcanic')) {
    m.grenadePeriod  = 3;
    const t = Math.min(1, (levelId - 21) / 9);
    m.bulletDuration = m.bulletDuration ?? Math.round(390 - t * 80);
  }

  if (worlds.includes('void')) {
    const t = Math.min(1, (levelId - 41) / 9);
    m.towerMoveDelay = Math.round(2000 - t * 1100);
    m.bulletDuration = m.bulletDuration ?? Math.round(370 - t * 80);
  }

  if (worlds.includes('frozen')) {
    const t = Math.min(1, (levelId - 31) / 9);
    m.bulletDuration = m.bulletDuration ?? Math.round(380 - t * 80);
    m.freezeDuration = worlds.length > 1 ? 500 : 700;
    m.freezePeriod   = worlds.length > 1 ? 6 : 3;
  }

  if (worlds.includes('poison')) {
    const t = Math.min(1, (levelId - 51) / 9);
    m.poisonInterval = Math.round(2000 - t * 800);
    m.bulletDuration = m.bulletDuration ?? Math.round(420 - t * 60);
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
  poison:   ['Toxic Fields','Plague Gate','The Swamp','Venom Pits','Rot Hollow','The Fungus','Spore Cloud','Decay Marsh','The Blight','Toxic Core'],
};

const MIX_NAMES = [
  // 2-world (61-96) — 36 names
  'Cursed Dungeon','Volcanic Grove','Frozen Crypt','Void Forest',
  'Ash Citadel','Lava Frost','Dark Volcano','Void Citadel',
  'Shadow Forge','Burning Ice','Null Crypt','Abyssal Grove',
  'Infernal Frost','Void Ember','Cursed Caldera','Dark Blizzard',
  'Bone Volcano','Shadow Ice','Lava Void','Cursed Abyss',
  'Frozen Rift','Dark Ember','Void Frost','Shadow Dungeon',
  'Toxic Grove','Plague Void','Venom Rift','Poison Dungeon',
  'Toxic Ember','Blight Forest','Poison Caldera','Venom Citadel',
  'Plague Frost','Toxic Abyss','Venom Dark','Poison Rift',
  // 3-world (97-106) — 10 names
  'Cursed Inferno','Void Caldera','Plague Dungeon','Frozen Ember',
  'Shadow Volcano','Toxic Citadel','Blight Rift','Venom Forge',
  'Dark Plague','Abyssal Frost',
  // 4-world (107-110) — 4 names
  'The Convergence','Chaos Nexus','The Maelstrom','Oblivion Gate',
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
  return { id, name, world: primaryWorld, worlds, shootDelay, required, towers, mechanics };
}

// ── Generate all levels ────────────────────────────────────────────────
const levels = [];

// Dungeon 1-10
for (let i = 0; i < 10; i++) {
  const id         = i + 1;
  const towerCount = i + 1;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(1150 - i * 35);
  levels.push(buildLevel(id, ['dungeon'], towerCount, required, shootDelay));
}

// Forest 11-20
for (let i = 0; i < 10; i++) {
  const id         = 11 + i;
  const towerCount = i + 2;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(1100 - i * 30);
  levels.push(buildLevel(id, ['forest'], towerCount, required, shootDelay));
}

// Volcanic 21-30
for (let i = 0; i < 10; i++) {
  const id         = 21 + i;
  const towerCount = i + 3;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(1050 - i * 25);
  levels.push(buildLevel(id, ['volcanic'], towerCount, required, shootDelay));
}

// Frozen 31-40
for (let i = 0; i < 10; i++) {
  const id         = 31 + i;
  const towerCount = i + 4;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(900 - i * 20);
  levels.push(buildLevel(id, ['frozen'], towerCount, required, shootDelay));
}

// Void 41-50
for (let i = 0; i < 10; i++) {
  const id         = 41 + i;
  const towerCount = i + 5;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(800 - i * 18);
  levels.push(buildLevel(id, ['void'], towerCount, required, shootDelay));
}

// Poison 51-60
for (let i = 0; i < 10; i++) {
  const id         = 51 + i;
  const towerCount = i + 5;
  const required   = Math.max(1, Math.floor(towerCount * 0.6));
  const shootDelay = Math.round(700 - i * 16);
  levels.push(buildLevel(id, ['poison'], towerCount, required, shootDelay));
}

// ── MIX WORLDS 61-110 ────────────────────────────────────────────────
// 2-world pairs first (easier mix), then 3-world, then 4-world
// Difficulty rises gradually: more towers, faster shootDelay

const mixConfigs = [
  // ── 2-world pairs ────────────────────────────────────────────────────

  // 61-62: Dungeon + Forest (lightest intro to mix)
  [['dungeon','forest'],  8, 4, 720],
  [['dungeon','forest'],  9, 5, 700],

  // 63-64: Dungeon + Volcanic
  [['dungeon','volcanic'], 9, 5, 680],
  [['dungeon','volcanic'],10, 6, 655],

  // 65-66: Forest + Volcanic
  [['forest','volcanic'], 10, 6, 635],
  [['forest','volcanic'], 11, 6, 615],

  // 67-68: Dungeon + Frozen
  [['dungeon','frozen'], 10, 6, 595],
  [['dungeon','frozen'], 11, 6, 587],

  // 69-70: Forest + Frozen
  [['forest','frozen'], 11, 6, 561],
  [['forest','frozen'], 12, 7, 544],

  // 71-72: Volcanic + Frozen
  [['volcanic','frozen'], 12, 7, 527],
  [['volcanic','frozen'], 13, 7, 510],

  // 73-74: Dungeon + Void
  [['dungeon','void'], 12, 7, 490],
  [['dungeon','void'], 13, 8, 475],

  // 75-76: Forest + Void
  [['forest','void'], 13, 7, 460],
  [['forest','void'], 14, 8, 450],

  // 77-78: Frozen + Void
  [['frozen','void'], 13, 8, 435],
  [['frozen','void'], 14, 8, 420],

  // 79-80: Volcanic + Void
  [['volcanic','void'], 14, 8, 400],
  [['volcanic','void'], 15, 9, 390],

  // 81-82: Dungeon + Poison
  [['dungeon','poison'], 13, 7, 380],
  [['dungeon','poison'], 14, 8, 370],

  // 83-84: Forest + Poison
  [['forest','poison'], 14, 8, 360],
  [['forest','poison'], 15, 9, 350],

  // 85-86: Volcanic + Poison
  [['volcanic','poison'], 14, 8, 340],
  [['volcanic','poison'], 15, 9, 330],

  // 87-88: Frozen + Poison
  [['frozen','poison'], 15, 9, 320],
  [['frozen','poison'], 16, 9, 310],

  // 89-90: Void + Poison
  [['void','poison'], 15, 9, 290],
  [['void','poison'], 16,10, 280],

  // ── 3-world combos (harder) ──────────────────────────────────────────

  // 91-92: Dungeon + Forest + Volcanic
  [['dungeon','forest','volcanic'], 14, 8, 270],
  [['dungeon','forest','volcanic'], 15, 9, 260],

  // 93-94: Forest + Frozen + Void
  [['forest','frozen','void'], 15, 9, 250],
  [['forest','frozen','void'], 16,10, 240],

  // 95-96: Volcanic + Frozen + Poison
  [['volcanic','frozen','poison'], 15, 9, 230],
  [['volcanic','frozen','poison'], 16,10, 220],

  // 97-98: Dungeon + Void + Poison
  [['dungeon','void','poison'], 16,10, 210],
  [['dungeon','void','poison'], 17,11, 200],

  // 99-100: Forest + Volcanic + Poison
  [['forest','volcanic','poison'], 16,10, 190],
  [['forest','volcanic','poison'], 17,11, 180],

  // ── 4-world combos (very hard) ───────────────────────────────────────

  // 101-102: Dungeon + Forest + Frozen + Void
  [['dungeon','forest','frozen','void'], 17,11, 154],
  [['dungeon','forest','frozen','void'], 18,12, 145],

  // 103-104: Forest + Volcanic + Void + Poison
  [['forest','volcanic','void','poison'], 18,12, 136],
  [['forest','volcanic','void','poison'], 19,13, 128],

  // 105-106: Dungeon + Volcanic + Frozen + Poison
  [['dungeon','volcanic','frozen','poison'], 19,13, 120],
  [['dungeon','volcanic','frozen','poison'], 20,14, 113],

  // 107-110: All 5 worlds (brutal)
  [['dungeon','forest','volcanic','frozen','void'],          19,14, 106],
  [['dungeon','forest','volcanic','frozen','poison'],        20,15,  99],
  [['forest','volcanic','frozen','void','poison'],           20,15,  92],
  [['dungeon','forest','volcanic','frozen','void','poison'], 21,16,  86],
];

mixConfigs.forEach(([worlds, towerCount, required, shootDelay], i) => {
  const id = 61 + i;
  levels.push(buildLevel(id, worlds, towerCount, required, shootDelay, MIX_NAMES[i]));
});

// ── HELL MODE 111-120 ─────────────────────────────────────────────────
const hellConfigs = [
  [['dungeon','forest','volcanic','frozen'],                        18, 13, 380],
  [['dungeon','forest','volcanic','frozen'],                        19, 14, 350],
  [['dungeon','forest','volcanic','void'],                          19, 14, 320],
  [['dungeon','forest','volcanic','void','poison'],                 20, 15, 290],
  [['forest','volcanic','frozen','void','poison'],                  20, 15, 260],
  [['forest','volcanic','frozen','void','poison'],                  21, 16, 230],
  [['dungeon','forest','volcanic','frozen','void'],                 21, 16, 200],
  [['dungeon','forest','volcanic','frozen','void','poison'],        22, 17, 170],
  [['dungeon','forest','volcanic','frozen','void','poison'],        23, 18, 140],
  [['dungeon','forest','volcanic','frozen','void','poison'],        25, 18, 110],
];

hellConfigs.forEach(([worlds, towerCount, required, shootDelay], i) => {
  const id = 111 + i;
  levels.push(buildLevel(id, worlds, towerCount, required, shootDelay, HELL_NAMES[i]));
});

export function generateEndlessLevel(wave) {
  const allWorlds = ['dungeon','forest','volcanic','frozen','void','poison'];
  
  // Shuffle χωρίς Phaser
  const shuffled = [...allWorlds].sort(() => Math.random() - 0.5);
  
  const worldCount = Math.min(2 + Math.floor(wave / 3), 6);
  const worlds     = shuffled.slice(0, worldCount);
  const towerCount = Math.min(10 + wave * 2, 40);
  const required   = Math.floor(towerCount * 0.6);
  const shootDelay = Math.max(80, 500 - wave * 15);
  return buildLevel(120 + wave, worlds, towerCount, required, shootDelay, `☠️ Wave ${wave}`);
}

export const LEVELS = levels;
export const TOTAL_LEVELS = levels.length; // 120