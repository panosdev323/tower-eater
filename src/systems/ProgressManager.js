const KEY_LEVEL    = 'te_level';
const KEY_BEST     = 'te_best';

export const ProgressManager = {
  // Αποθήκευσε το τρέχον level (0-indexed)
  saveLevel(levelIndex) {
    localStorage.setItem(KEY_LEVEL, String(levelIndex));
  },

  // Πάρε το αποθηκευμένο level (0-indexed)
  getSavedLevel() {
    const v = localStorage.getItem(KEY_LEVEL);
    return v === null ? 0 : parseInt(v, 10);
  },

  // Reset progress
  reset() {
    localStorage.removeItem(KEY_LEVEL);
    localStorage.removeItem(KEY_BEST);
  },

  // Best level reached
  updateBest(levelIndex) {
    const current = parseInt(localStorage.getItem(KEY_BEST) ?? '0', 10);
    if (levelIndex > current) {
      localStorage.setItem(KEY_BEST, String(levelIndex));
    }
  },

  getBest() {
    return parseInt(localStorage.getItem(KEY_BEST) ?? '0', 10);
  }
};