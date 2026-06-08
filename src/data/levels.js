// Helper για να φτιάχνουμε levels αυτόματα
function makeTower(col, row, type) {
  return { col, row, type };
}

export const LEVELS = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  const world = id <= 10 ? 'dungeon'
              : id <= 20 ? 'forest'
              : id <= 30 ? 'volcanic'
              : id <= 40 ? 'frozen'
              : 'void';

  const worldNames = {
    dungeon:  ['The Outskirts', 'The Corridor', 'Dark Halls', 'Stone Keep', 'The Dungeon', 'Ancient Vaults', 'Crypt Entrance', 'The Catacombs', 'Bone Chamber', 'The Throne'],
    forest:   ['Cursed Grove', 'Twisted Paths', 'Dark Canopy', 'The Thicket', 'Root Maze', 'Elder Trees', 'The Hollow', 'Witch Woods', 'Shadow Pines', 'The Heart'],
    volcanic: ['Ember Fields', 'Lava Flow', 'Ash Plains', 'Magma Gate', 'Fire Pits', 'The Caldera', 'Inferno Pass', 'Molten Core', 'Brimstone', 'The Volcano'],
    frozen:   ['Frost Edge', 'Ice Plains', 'Blizzard Pass', 'Frozen Lake', 'Glacial Rift', 'The Tundra', 'Crystal Caves', 'Permafrost', 'The Blizzard', 'The Citadel'],
    void:     ['The Rift', 'Dark Matter', 'Null Space', 'The Abyss', 'Shadow Realm', 'Void Nexus', 'The Nothing', 'Dark Infinity', 'Oblivion', 'The End'],
  };

  const nameIndex = (id - 1) % 10;
  const name = worldNames[world][nameIndex];

  const towerCount = nameIndex + 1;
  const required = Math.max(1, Math.floor(towerCount * 0.6));

  // Shoot delay: starts slow, gets faster
  const shootDelay = Math.max(600, 2000 - id * 28);

  const towers = generateTowers(towerCount, id);

  // ── Per-world mechanics ──────────────────────────────────────────────
  // dungeon (1-10):   baseline, no extras
  // forest (11-20):   bullets are faster (bulletDuration ms instead of 500)
  // volcanic (21-30): every grenadePeriod-th shot is a grenade (AoE, 2× dmg)
  // frozen (41-50):   towers shoot ice shards that slow monster temporarily  ← same as dungeon for now
  // void (41-50):     towers move randomly every towerMoveDelay ms

  let mechanics = {};

  if (world === 'forest') {
    // bullet travel time shrinks from 400ms (lvl11) down to 220ms (lvl20)
    const t = (id - 11) / 9; // 0..1
    mechanics.bulletDuration = Math.round(400 - t * 180); // 400→220
  }

  if (world === 'volcanic') {
    // every 3rd shot is a grenade; grenade period stays at 3 for all volcanic
    mechanics.grenadePeriod = 3;
  }

  if (world === 'void') {
    // towers move every 2500ms (lvl41) down to 1600ms (lvl50)
    const t = (id - 41) / 9;
    mechanics.towerMoveDelay = Math.round(2500 - t * 900); // 2500→1600
  }

  return { id, name, world, shootDelay, required, towers, mechanics };
});

function generateTowers(count, levelId) {
  const positions = [
    {col:5, row:5}, {col:7, row:9}, {col:3, row:7},
    {col:8, row:4}, {col:2, row:4}, {col:6, row:12},
    {col:4, row:3}, {col:8, row:11},{col:2, row:10},
    {col:6, row:7}, {col:9, row:6}, {col:1, row:6},
  ];

  const offset = (levelId * 3) % positions.length;
  const rotated = [...positions.slice(offset), ...positions.slice(0, offset)];

  return rotated.slice(0, count).map((pos, i) => ({
    ...pos,
    type: ['fire', 'ice', 'arcane'][i % 3]
  }));
}