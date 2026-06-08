export class PathFinder {
  // BFS - βρίσκει shortest path από start σε goal
  // towers είναι blocked cells
  static findPath(start, goal, cols, rows, blockedCells) {
    const key = (c, r) => `${c},${r}`;
    const blocked = new Set(blockedCells.map(c => key(c.col, c.row)));

    const queue = [{ col: start.col, row: start.row, path: [] }];
    const visited = new Set([key(start.col, start.row)]);

    const dirs = [
      { dc: 0, dr: -1 }, // up
      { dc: 0, dr: 1  }, // down
      { dc: -1, dr: 0 }, // left
      { dc: 1, dr: 0  }, // right
    ];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.col === goal.col && current.row === goal.row) {
        return current.path;
      }

      for (const dir of dirs) {
        const nc = current.col + dir.dc;
        const nr = current.row + dir.dr;
        const k = key(nc, nr);

        if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
        if (visited.has(k)) continue;
        // Towers είναι blocked ΕΚΤΟΣ αν είναι ο goal
        if (blocked.has(k) && !(nc === goal.col && nr === goal.row)) continue;

        visited.add(k);
        queue.push({
          col: nc,
          row: nr,
          path: [...current.path, { col: nc, row: nr }]
        });
      }
    }

    return []; // Δεν βρέθηκε path
  }
}