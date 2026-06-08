// Helper για να φτιάχνουμε levels αυτόματα
function makeTower(col, row, type) {
  return { col, row, type };
}

// Tower type rotation
const T = ['fire', 'ice', 'arcane'];

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

  // Progressive tower count: 1,2,3,4,5,6,7,8,9,10 ανά world
  const towerCount = nameIndex + 1;
  const required = Math.max(1, Math.floor(towerCount * 0.6));

  // Shoot delay: αρχίζει slow, γίνεται πιο γρήγορο
  const shootDelay = Math.max(600, 2000 - id * 28);

  // Τοποθέτηση πύργων — διαφορετικά patterns
  const towers = generateTowers(towerCount, id);

  return { id, name, world, shootDelay, required, towers };
});

function generateTowers(count, levelId) {
  // Grid positions — αποφεύγουμε start (col1,row13) και base (col5,row1)
  const positions = [
    {col:5, row:5}, {col:7, row:9}, {col:3, row:7},
    {col:8, row:4}, {col:2, row:4}, {col:6, row:12},
    {col:4, row:3}, {col:8, row:11},{col:2, row:10},
    {col:6, row:7}, {col:9, row:6}, {col:1, row:6},
  ];

  // Rotate positions per level για variety
  const offset = (levelId * 3) % positions.length;
  const rotated = [...positions.slice(offset), ...positions.slice(0, offset)];

  return rotated.slice(0, count).map((pos, i) => ({
    ...pos,
    type: ['fire', 'ice', 'arcane'][i % 3]
  }));
}